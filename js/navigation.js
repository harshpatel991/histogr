// Load each of the views into their section of the page
// Makes the window.html page cleaner
$(function() {
  $("#nodes").load("/html/nodes.html", function() {
    var script = document.createElement('script'); //done loading the HTML, load the corresponding JS
    script.src = '/js/nodes.js';
    document.head.appendChild(script);
  })
});

$(function() {
  $("#timeline").load("/html/timeline.html", function() {
    var script = document.createElement('script'); //done loading the HTML, load the corresponding JS
    script.src = '/js/timeline.js';
    document.head.appendChild(script);
  })
});

$(function() {
  $("#analysis").load("/html/analysis.html", function() {
    var script = document.createElement('script'); //done loading the HTML, load the corresponding JS
    script.src = '/js/analysis.js';
    document.head.appendChild(script);
  });
});

$(function() {
  $("#banlist").load("/html/banlist.html", function() {
    var script = document.createElement('script'); //done loading the HTML, load the corresponding JS
    script.src = '/js/banlist.js';
    document.head.appendChild(script);
  });
});
