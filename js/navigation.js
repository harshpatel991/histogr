// Load each of the views into their section of the page
// Makes the window.html page cleaner
$(function() {
  $("#nodes").load("/html/nodes.html", function() {

    var data = [4, 8, 15, 16, 23, 42];
    var x = d3.scale.linear()
        .domain([0, d3.max(data)])
        .range([0, 420]);

    d3.select(".nodes-chart")
      .selectAll("div")
        .data(data)
      .enter().append("div")
        .style("width", function(d) { return x(d) + "px"; })
        .text(function(d) { return d; });
  });
});

$(function() {
  $("#timeline").load("/html/timeline.html", function() {
    var data = [1, 2, 3, 5, 6];

    var x = d3.scale.linear()
        .domain([0, d3.max(data)])
        .range([0, 420]);

    d3.select(".timeline-chart")
      .selectAll("div")
        .data(data)
      .enter().append("div")
        .style("width", function(d) { return x(d) + "px"; })
        .text(function(d) { return d; });
  });
});

$(function() {
  $("#analysis").load("/html/analysis.html", function() {
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
  });
});

$(function() {
  $("#banlist").load("/html/banlist.html");
});
