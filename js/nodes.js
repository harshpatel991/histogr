//On clicking the banlist side bar button, refresh the lists
$("#node-button").click(function() {
    $('#mainTabList a[href="#nodes"]').tab('show');
    listRestrictedDomains();
    listDistractingDomains();
    closeToolTip();
});

$(document).ready(function(){
    console.log('0here');
    document.addEventListener('parse', function(value) {
        generateGraph(getGraphData(value.detail.parsedDomainHistory));
    });
});

var goldenLinkRatio = 0.25;

function getGraphData(domainHistory){
    domainHistory.sort(function (a, b) {
        return b.totalFreq - a.totalFreq
    });
    var slicedHistory = domainHistory.slice(0, 20);
    var graphData = {nodes: [], links: []};

    var totalFreq = 0;
    var totalLinks = 0;
    var totalItems = slicedHistory.length;
    var dataTranslation = [];
    var iter = 0;
    for (var i in slicedHistory){
        var historyItem = slicedHistory[i];
        totalFreq += historyItem.totalFreq;
        for (var j in historyItem.outgoingLinks){
            totalLinks += historyItem.outgoingLinks[j];
        }
        dataTranslation[historyItem.id] = iter++;
        graphData.nodes.push({"id": historyItem.id, "domain": historyItem.name, "size": 8});
    }
    console.log(totalLinks);

    for (i in slicedHistory) {
        historyItem = slicedHistory[i];
        for (j in historyItem.outgoingLinks){
            var linkFreq = historyItem.outgoingLinks[j];
            if (linkFreq > goldenLinkRatio * totalLinks / totalItems){
                graphData.links.push({"source":  dataTranslation[historyItem.id], "target": dataTranslation[j]})
            }
        }

    }

    console.log(graphData);

    return graphData;
}

var tooltip = '';

function generateGraph(graphData) {
    var margin = {top: 20, right: 20, bottom: 100, left: 40};
//Adapted from d3.js Sticky Force Layout guide http://bl.ocks.org/mbostock/3750558
    var width = 500,
        height = 250;

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
        .on("click", function (e) {
            closeToolTip();
        })
        .attr("viewBox", "0 0 960 500");
    //.attr("preserveAspectRatio", "xMinYMin");

//Fade nodes into view
    svg.style("opacity", 1e-6)
        .transition()
        .duration(1500)
        .style("opacity", 1);

    var link = svg.selectAll(".link"),
        node = svg.selectAll(".node");

    tooltip = d3.select(".nodes-chart")
        .append("div")
        .attr("class", "nodes-tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("a simple tooltip");

        force.nodes(graphData.nodes)
            .links(graphData.links)
            .start();

        link = link.data(graphData.links)
            .enter().append("line")
            .attr("class", "link");

        node = node.data(graphData.nodes)
            .enter().append("circle")
            .attr("r", function (d) {
                return d.size * 2;
            }) //set size for each node to the value read from json
            .attr("class", "node")
            .on("click", function (d) {
                clickNode(d);
                d3.event.stopPropagation();
            }) //don't let propigation move to outside svg
            .call(drag);

    function clickNode(data) {
        var parentOffset = $('.nodes-chart').parent().offset(); //calculate where the tool tip needs to appear
        var relX = event.pageX - parentOffset.left;
        var relY = event.pageY - parentOffset.top;

        existsInStorage("distractingDomains", data.domain, function (exists) { //determine what text needs to be in the tool tip
            var toolTipBox = '<div class="panel panel-default"> <div class="panel-heading"> <h3 class="panel-title">' + data.domain + ' <button class="btn btn-danger btn-xs" id="close-tooltip"><span class="glyphicon glyphicon-remove"></span></button></h3> </div> <div class="panel-body">Size: ' + data.size + '<br/>id: ' + data.id + '<hr>';

            if (!exists) {
                toolTipBox += '<button class="btn btn-primary btn-xs center-block" id="nodesAddAsDistraction"><span class="glyphicon glyphicon-plus"></span> Add as Distraction</button></div> </div>';
                tooltip.style("visibility", "visible")
                    .html(toolTipBox)
                    .style("top", (relY) + "px")
                    .style("left", (relX + 10) + "px");
                $("#nodesAddAsDistraction").click(function () {
                    addDistractingDomain(data.domain);
                    closeToolTip();
                });
            }
            else {
                toolTipBox += '<div class="green"><span class="glyphicon glyphicon-ok"></span> Marked as Distraction</div></div> </div>';
                tooltip.style("visibility", "visible")
                    .html(toolTipBox)
                    .style("top", (relY) + "px")
                    .style("left", (relX + 10) + "px");
            }
            $("#close-tooltip").click(function () {
                closeToolTip();
            });
        });
    }

    function tick() {
        link.attr("x1", function (d) {
            return d.source.x;
        })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node.attr("cx", function (d) {
            return d.x;
        })
            .attr("cy", function (d) {
                return d.y;
            });
    }

//When starting to drag, set the node as fixed
    function dragstart(d) {
        d3.select(this).classed("fixed", d.fixed = true);
    }

//Resize on window size change, keep aspect ratio
    chart = $("#nodes-svg");
    $(window).on("resize", function () {
        scaleGraph();
    });

//Change size of graph to fit parent element
    function scaleGraph() {
        var aspect = width / height;
        var targetWidth = chart.parent().width();
        var targetHeight = chart.parent().height();

        chart.attr("width", "100%");
        chart.attr("height", "100%");
    }

//Run resizing first time when opening app
    scaleGraph();
}

function closeToolTip() {
    tooltip.style("visibility", "hidden");
}