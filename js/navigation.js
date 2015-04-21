// Load each of the views into their section of the page
// Makes the window.html page cleaner
$(function() {
  $("#nodes").load("/html/nodes.html", function() {
    var script = document.createElement('script'); //done loading the HTML, load the corresponding JS
    script.src = '/js/nodes.js';
    document.head.appendChild(script);

    var timeFrameSlectorScript = document.createElement('script');
    timeFrameSlectorScript.src = '/js/timeFrameSelector.js';
    document.head.appendChild(timeFrameSlectorScript);
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

    $("#analysis-history").load("/html/analysis-history.html", function() { //load the history tab
      var scriptHistory = document.createElement('script'); //done loading the HTML, load the corresponding JS
      scriptHistory.src = '/js/analysis-history.js';
      document.head.appendChild(scriptHistory);
    });

    $("#analysis-distractions").load("/html/analysis-distractions.html", function() { //load the distractions tab
      var scriptDistractions = document.createElement('script'); //done loading the HTML, load the corresponding JS
      scriptDistractions.src = '/js/analysis-distractions.js';
      document.head.appendChild(scriptDistractions);
    });

  });
});

$(function() {
  $("#banlist").load("/html/banlist.html", function() {
    var script = document.createElement('script'); //done loading the HTML, load the corresponding JS
    script.src = '/js/banlist.js';
    document.head.appendChild(script);
  });
});
