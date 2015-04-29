function createPieGraph(historyData) {
    d3.select(".analysis-chart-pie").html('');
    var margin = {top: 20, right: 20, bottom: 100, left: 40};

    var $chartDiv = $('.analysis-chart-pie');
    var width = 400,
        height = 250,
        radius = Math.min(width, height) / 2;

    var svg = d3.select(".analysis-chart-pie")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g");

    svg.append("g")
        .attr("class", "slices");
    svg.append("g")
        .attr("class", "labels");
    svg.append("g")
        .attr("class", "lines");

    var pie = d3.layout.pie()
        .sort(null)
        .value(function (d) {
            return d.value;
        });

    var arc = d3.svg.arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.4);

    var outerArc = d3.svg.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

    svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var key = function (d) {
        return d.data.label;
    };

    var color = d3.scale.ordinal()
        .domain(["Distraction", "Trigger", "Other"])
        .range([CustomColors.distraction, CustomColors.trigger, CustomColors.regular]);

    function randomData() {
        var labels = color.domain();
        return labels.map(function (label) {
            return {label: label, value: Math.random()}
        });
    }

    change(randomData());

    $(".randomize")
        .on("click", function () {
            change(randomData());
        });


    function change(data) {

        /* ------- PIE SLICES -------*/
        var slice = svg.select(".slices").selectAll("path.slice")
            .data(pie(data), key);

        slice.enter()
            .insert("path")
            .style("fill", function (d) {
                return color(d.data.label);
            })
            .attr("class", "slice");

        slice
            .transition().duration(1000)
            .attrTween("d", function (d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function (t) {
                    return arc(interpolate(t));
                };
            });

        slice.exit()
            .remove();


    }
}