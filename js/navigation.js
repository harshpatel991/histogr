// Load each of the views into their section of the page
// Makes the window.html page cleaner

$(function() {
  //Load nodes
  $("#nodes").load("/html/nodes.html", function () {
    var script = document.createElement('script'); //done loading the HTML, load the corresponding JS
    script.src = '/js/nodes.js';
    document.head.appendChild(script);
    console.log('nodes loaded');

    var timeFrameSlectorScript = document.createElement('script');
    timeFrameSlectorScript.src = '/js/timeFrameSelector.js';
    document.head.appendChild(timeFrameSlectorScript);

    // Load timeline
    $("#timeline").load("/html/timeline.html", function () {
      var script = document.createElement('script'); //done loading the HTML, load the corresponding JS
      script.src = '/js/timeline.js';
      document.head.appendChild(script);
      console.log('timeline loaded');

      // Load analysis
      $("#analysis").load("/html/analysis.html", function () {
        var script = document.createElement('script'); //done loading the HTML, load the corresponding JS
        script.src = '/js/analysis.js';
        document.head.appendChild(script);
        console.log('analysis loaded');

        // Load analysis-history
        $("#analysis-history").load("/html/analysis-history.html", function () { //load the history tab
          var scriptHistory = document.createElement('script'); //done loading the HTML, load the corresponding JS
          scriptHistory.src = '/js/analysis-history.js';
          document.head.appendChild(scriptHistory);
          console.log('analysis-history loaded');

          // Load analysis-distractions
          $("#analysis-distractions").load("/html/analysis-distractions.html", function () { //load the distractions tab
            var scriptDistractions = document.createElement('script'); //done loading the HTML, load the corresponding JS
            scriptDistractions.src = '/js/analysis-distractions.js';
            document.head.appendChild(scriptDistractions);
            console.log('analysis-distractions loaded');

            // Load banlist
            $("#banlist").load("/html/banlist.html", function () {
              var script = document.createElement('script'); //done loading the HTML, load the corresponding JS
              script.src = '/js/banlist.js';
              document.head.appendChild(script);
              console.log('banlist loaded');

              onAllTabsLoaded();
            });
          });
        });
      });
    });
  });
});

function onAllTabsLoaded(){
  var microsecondsInTimeSpan = 1000 * 60 * 60 * 24;
  var timeNow = (new Date).getTime();
  var timeYesterday = timeNow - microsecondsInTimeSpan;
  console.log('parsing');
  Parser.parseHistoryFromSpan(timeYesterday, timeNow);
}