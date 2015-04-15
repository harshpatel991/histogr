var data = [1, 1, 2, 2, 3, 3];

var x = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([0, 420]);

d3.select(".analysis-chart")
  .selectAll("div")
    .data(data)
  .enter().append("div")
    .style("width", function(d) { return x(d) + "px"; })
    .text(function(d) { return d; });
