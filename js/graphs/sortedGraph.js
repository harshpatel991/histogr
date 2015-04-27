function onParse(historyData) {
    /*retrieveFromStorage('title', function(value){
        $('#analysis-chart-title').text(value);
    });*/

    //$('#analysis-chart-title').text(parsedDomainHistory[0].name);
    createGraph(historyData);
}

function createGraph(historyData) {
    d3.select(".analysis-chart-sort").html('');
    var margin = {top: 20, right: 20, bottom: 100, left: 40},
        width = 500,
        height = 250;


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

    var svg = d3.select(".analysis-chart-sort").append("svg")
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
            .attr("transform", function(d) {
                return "rotate(-65)"
            });

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Frequency");

        svg.selectAll(".bar")
            .data(historyData)
            .enter().append("rect")
            .attr("class", "bar")
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

        d3.select("input").on("change", change);

        var sortTimeout = setTimeout(function () {
            d3.select("input").property("checked", false).each(change);
        }, 2000);

        function change() {
            clearTimeout(sortTimeout);
            //alert('asdf');

            // Copy-on-write since tweens are evaluated after a delay.
            var x0 = x.domain(historyData.sort(this.checked
                ? function (a, b) {
                return b.totalFreq - a.totalFreq;
            }
                : function (a, b) {
                return d3.ascending(a.name, b.name);
            })
                .map(function (d) {
                    return d.name;
                }))
                .copy();

            svg.selectAll(".bar")
                .sort(function (a, b) {
                    return x0(a.name) - x0(b.name);
                });

            var transition = svg.transition().duration(750),
                delay = function (d, i) {
                    return i * 50;
                };

            transition.selectAll(".bar")
                .delay(delay)
                .attr("x", function (d) {
                    return x0(d.name);
                });

            transition.select(".x.axis")
                .call(xAxis)
                .selectAll("g")
                .delay(delay);
        }
}