//Graph adapted from d3.js Sticky Force Layout guide http://bl.ocks.org/mbostock/3750558

//On clicking the banlist side bar button, refresh the lists
$("#node-button").click(function () {
    $('#mainTabList a[href="#nodes"]').tab('show');
    $('#openTutorialLink').attr('data-slide-to', '0');
    fadeOutInToolBar();

    setTitleText("Nodes", "A graphical representation of the websites you visit.", "This tab displays the URLs you have visited and displays calculated relationships between URLs.");

});

function setTitleText(title, subtitle, helptext) {
    var titleHtml = '<span class="tutorial-tootlip" title="'+helptext+'">'+title+'<span class="help-icon glyphicon glyphicon-question-sign" style="font-size: 30px"></span> </span>';
    fadeOutInItem($('#page-title'), function () {
        $('#page-title').text(title);
    });
    fadeOutInItem($('#help-text-title'), function () {
        $('#help-text-title').tooltipster('content', helptext);
    });
    fadeOutInItem($('#page-sub-title'), function () {
        $('#page-sub-title').html(subtitle);
    });
}

// Run when this tab is finished loading
$(function () {
    document.addEventListener('parse', function (value) {
        generateNodesGraph(getNodeGraphData(value.detail.parsedDomainHistory), ".nodes-chart")
    });

    document.addEventListener('reparseUpdate', function (value) {
        redrawColors(value.detail.domainTypeDict);
    });
});

var goldenSizeRatio = 10;

function getSingleNodesGraphData(domainHistory, domainNames) {
    return getNodeGraphData(domainHistory);
}

function redrawColors(domainTypes) {
    $('.node-label').each(function () {
        var domainName = $(this).text();
        var $parentNode = $(this).parent();
        var domainType = domainTypes[domainName];
        $parentNode.attr('style', 'fill: ' + CustomColors[domainType]);
    });
}

function getNodeGraphData(domainHistory) {
    domainHistory = domainHistory.slice(0).sort(function (a, b) {
        return b.totalFreq - a.totalFreq
    });

    var slicedHistory = domainHistory.slice(0, 30);
    var graphData = {nodes: [], links: []};
    var totalFreq = 0;
    var totalItems = slicedHistory.length;
    var dataTranslation = [];
    var iter = 0;
    for (var i = 0; i < totalItems; i++) {
        var historyItem = slicedHistory[i];
        totalFreq += historyItem.totalFreq;
        dataTranslation[historyItem.id] = iter++;
        graphData.nodes.push({
            "id": historyItem.id,
            "domain": historyItem.name,
            "size": historyItem.totalFreq,
            "domainType": historyItem.domainType
        });
    }

    for (i in slicedHistory) {
        historyItem = slicedHistory[i];
        for (j in historyItem.outgoingRelations) {
            if (dataTranslation[j] != undefined) {
                graphData.links.push({"source": dataTranslation[historyItem.id], "target": dataTranslation[j]});
            }
        }
    }

    var avgFreq = totalFreq / totalItems;
    for (i in graphData.nodes) {
        graphData.nodes[i].size *= goldenSizeRatio / avgFreq;

        graphData.nodes[i].size = ((Math.log(graphData.nodes[i].size) + 1.5) / 2.8) * 10
    }
    return graphData;
}


function generateNodesGraph(graphData, divSelector) {
    var margin = {top: 20, right: 20, bottom: 100, left: 40};
    $(divSelector).html('');

    var width = 850,
        height = 450;

    var force = d3.layout.force()
        .size([width, height])
        .charge(function (d) {
            return -1 * d.size * 100;
        })
        .linkDistance(function (d) {
            return (d.source.size + d.target.size) * 4.5;
        })
        .gravity(.4)
        .on("tick", tick);

    var drag = force.drag()
        .on("dragstart", dragstart);

    var svg = d3.select(divSelector).append("svg")
        .attr("id", "nodes-svg")
        .attr("width", width)
        .attr("height", height)
        .on("click", function (e) {
            closeToolTip();
        })
        .attr("viewBox", "0 0 960 500");

    //Fade nodes into view
    svg.style("opacity", 1e-6)
        .transition()
        .duration(1500)
        .style("opacity", 1);

    var link = svg.selectAll(".link"),
        node = svg.selectAll(".node");

    var tooltip = d3.select(".nodes-chart")
        .append("div")
        .attr("class", "nodes-tooltip")
        .text("a simple tooltip");

    force.nodes(graphData.nodes)
        .links(graphData.links)
        .start();

    link = link.data(graphData.links)
        .enter().append("line")
        .attr("class", "link");

    node = node.data(graphData.nodes)
        .enter().append("g")

        .attr("class", "node")
        .attr("style", function (d) {
            return "fill: " + CustomColors.getTypeColor(d.domainType);
        })
        .on("contextmenu", function (d) {
            rightClickNode(d);
            d3.event.stopPropagation(); //don't let propigation move to outside svg
            d3.event.preventDefault();
        })
        .call(drag);

    node.append("circle")
        .attr("r", function (d) { //set size for each node to the value read from json
            return d.size * 2;
        });

    node.append("text")
        .attr("padding-top", "10px")
        .attr("text-anchor", "middle")
        .attr("class", "node-label")
        .attr("font-size", function (d) {
            return ((Math.log(d.size) + 1) / 2.5) * 10
        })
        .text(function (d) {
            return d.domain
        });

    function rightClickNode(data) {
        var parentOffset = $('.nodes-chart').parent().offset(); //calculate where the tool tip needs to appear
        var relX = event.pageX - parentOffset.left;
        var relY = event.pageY - parentOffset.top;

        existsInStorage("distractingDomains", data.domain, function (exists) { //determine what text needs to be in the tool tip
            var toolTipBox = '<div class="panel panel-default"> <div class="panel-heading"> <h3 class="panel-title">' + data.domain + ' <button class="btn btn-danger btn-xs pull-right" id="close-tooltip"><span class="glyphicon glyphicon-remove"></span></button></h3> </div> <div class="panel-body"><b>Type: </b>' + data.domainType + '<hr>';

            if (!exists) {
                toolTipBox += '<button class="btn btn-primary btn-xs center-block" id="nodesAddAsDistraction"><span class="glyphicon glyphicon-plus"></span> Add as Distraction</button></div> </div>';
                tooltip.style("visibility", "visible")
                    .html(toolTipBox)
                    .style("top", (relY + 193) + "px")
                    .style("left", (relX) + "px");
                $("#nodesAddAsDistraction").click(function () {
                    addDistractingDomain(data.domain, true);
                    closeToolTip();
                });
            }
            else {
                toolTipBox += '<button class="btn btn-danger btn-xs center-block" id="nodesRemoveAsDistraction"><span class="glyphicon glyphicon-minus"></span> Remove Distraction</button></div> </div>';
                tooltip.style("visibility", "visible")
                    .html(toolTipBox)
                    .style("top", (relY + 193) + "px")
                    .style("left", (relX) + "px");
                $("#nodesRemoveAsDistraction").click(function () {
                    deleteDistractionByDomain(data.domain);
                    closeToolTip();
                })
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

        node.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    }

//When starting to drag, set the node as fixed
    function dragstart(d) {
        //d3.select(this).classed("fixed", d.fixed = true);
    }

//Resize on window size change, keep aspect ratio
    var chart = $("#nodes-svg");
    $(window).on("resize", function () {
        scaleGraph();
    });

//Change size of graph to fit parent element
    function scaleGraph() {
        chart.attr("width", "100%");
        chart.attr("height", "100%");
    }

    function closeToolTip() {
        tooltip.style("visibility", "hidden");
    }

//Run resizing first time when opening app
    scaleGraph();
}


function deleteDistractionByDomain(domain){
    retrieveFromStorage('distractingDomains', function(distractions){
        if(distractions !== undefined) {
            var idx = distractions.indexOf(domain);
            if (idx > -1) {
                deleteDistractingDomain(idx, true)();
            }
        }
    });
}