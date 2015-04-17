//Adapted from d3.js Sticky Force Layout guide http://bl.ocks.org/mbostock/3750558

var width = 960,
    height = 550;

var force = d3.layout.force()
    .size([width, height])
    .charge(-100)
    .linkDistance(50)
    .on("tick", tick);

var drag = force.drag()
    .on("dragstart", dragstart);

var svg = d3.select(".nodes-chart").append("svg")
    .attr("id", "nodes-svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", "0 0 960 500")
    .attr("preserveAspectRatio", "xMidYMid");

//Fade nodes into view
svg.style("opacity", 1e-6)
    .transition()
    .duration(1500)
    .style("opacity", 1);

var link = svg.selectAll(".link"),
    node = svg.selectAll(".node");

d3.json("graph.json", function(error, graph) {
    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

    link = link.data(graph.links)
        .enter().append("line")
        .attr("class", "link");

    node = node.data(graph.nodes)
        .enter().append("circle")
        .attr("r", function(d) { return d.size*2;}) //set size for each node to the value read from json
        .attr("class", "node")
        .on("dblclick", dblclick)
        .call(drag);
});

function tick() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
}

//Free the node when it's double clicked
function dblclick(d) {
    d3.select(this).classed("fixed", d.fixed = false);
}

//When starting to drag, set the node as fixed
function dragstart(d) {
    d3.select(this).classed("fixed", d.fixed = true);
}

//Resize on window size change, keep aspect ratio
chart = $("#nodes-svg");
$(window).on("resize", function() {
    scaleGraph();
});

//Change size of graph to fit parent element
function scaleGraph() {
    var aspect = width / height;
    var targetWidth = chart.parent().width();
    chart.attr("width", targetWidth);
    chart.attr("height", targetWidth / aspect);
}

//Run resizing first time when opening app
scaleGraph();