var svg = ''
function createBarGraph(historyData) {
    d3.select(".analysis-chart-sort").html('');
    var margin = {top: 20, right: 20, bottom: 100, left: 40},
        width = 1100,
        height = 200;


    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1, 1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    svg = d3.select(".analysis-chart-sort").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    historyData.forEach(function (d) {
        d.totalFreq = +d.totalFreq;
    });

    x.domain(historyData.map(function (d) {
        return d.name;
    }));
    y.domain([0, d3.max(historyData, function (d) {
        return d.totalFreq;
    })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function (d) {
            return "rotate(-70)"
        });

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Visits");

    svg.selectAll(".bar")
        .data(historyData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("style", function (d) {
            return "fill: " + CustomColors.getTypeColor(d.domainType);
        })
        .attr("x", function (d) {
            return x(d.name);
        })
        .attr("width", x.rangeBand())
        .attr("y", function (d) {
            return y(d.totalFreq);
        })
        .attr("height", function (d) {
            return height - y(d.totalFreq);
        });

    var $radioButtons = $('input:radio[name=sortGraphOptions]');

    //$("#analysisChartSort-selection").on("change", change);
    $radioButtons.on('change', function () {
        change(this.value);
    });

    //console.log('radio: ' + $radioButtons.value());
    change($('input:radio[name=sortGraphOptions]:checked').val());

    function change(sortValue) {

        // Copy-on-write since tweens are evaluated after a delay.
        var x0 = x.domain(historyData.sort(function (a, b) {
            if (sortValue === 'name') {
                return d3.ascending(a.name, b.name);
            }
            else if (sortValue === 'visits') {
                return b.totalFreq - a.totalFreq;
            }
            else {
                return a.graphIdx - b.graphIdx;
            }
        })
            .map(function (d) {
                return d.name;
            }))
            .copy();

        svg.selectAll(".bar")
            .sort(function (a, b) {
                return x0(a.name) - x0(b.name);
            });

        var transition = svg.transition().duration(400),
            delay = function (d, i) {
                return i * 5;
            };

        transition.selectAll(".bar")
            .delay(delay)
            .attr("x", function (d) {
                return x0(d.name);
            });

        transition.select(".x.axis")
            .attr("transform", "translate(0," + height + ")")
            .style("text-anchor", "end")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .selectAll("g")
            .delay(delay);
    }

    var chart = $(".analysis-chart-sort svg");
    $(window).on("resize", function () {
        //scaleGraph();
    });

//Change size of graph to fit parent element
    function scaleGraph() {
        var aspect = width / height;
        var targetWidth = chart.parent().width();
        var targetHeight = chart.parent().height();
        console.log('width: ' + targetWidth);
        console.log('height: ' + targetHeight);
        chart.attr("width", targetWidth + "px");
        chart.attr("height", targetHeight + "px");
    }

    //scaleGraph();
}