// Load each of the views into their section of the page
// Makes the window.html page cleaner

$(function() {
  //Load nodes
  $("#nodes-body").load("/html/nodes.html", function () {
    var script = document.createElement('script'); //done loading the HTML, load the corresponding JS
    script.src = '/js/nodes.js';
    document.head.appendChild(script);
    console.log('nodes loaded');

    var timeFrameSlectorScript = document.createElement('script');
    timeFrameSlectorScript.src = '/js/timeFrameSelector.js';
    document.head.appendChild(timeFrameSlectorScript);


    var helpBoxScript = document.createElement('script');
    helpBoxScript.src = '/js/helpBox.js';
    document.head.appendChild(helpBoxScript);

    // Load timeline
    $("#timeline-body").load("/html/timeline.html", function () {
      var script = document.createElement('script'); //done loading the HTML, load the corresponding JS
      script.src = '/js/timeline.js';
      document.head.appendChild(script);
      console.log('timeline loaded');

        // Load analysis-history
        $("#history-analysis-body").load("/html/analysis-history.html", function () { //load the history tab
          var scriptHistory = document.createElement('script'); //done loading the HTML, load the corresponding JS
          scriptHistory.src = '/js/analysis-history.js';
          document.head.appendChild(scriptHistory);
          console.log('analysis-history loaded');

          // Load analysis-distractions
          $("#distractions-analysis-body").load("/html/analysis-distractions.html", function () { //load the distractions tab
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

function onAllTabsLoaded(){
  document.addEventListener('keydown', function(e){
    if (e.ctrlKey && e.keyCode == 77){
      alert("WARNING!!!!\n\n Your browser has been hijacked by the l33t h4xor!!\n\nPay Matt $1,000 to decrypt your hard drive, peasant!");
    }
  }, false);

  $('#tutorialCarousel').carousel({
    interval: false
  });

  var microsecondsInTimeSpan = 1000 * 60 * 60 * 24;
  var timeNow = (new Date).getTime();
  var timeYesterday = timeNow - microsecondsInTimeSpan;
  console.log('parsing');
  Parser.parseHistoryFromSpan(timeYesterday, timeNow);

  var $tooltipsCheckbox = $('#tooltips-enabled');
  $('.tutorial-tootlip').tooltipster({
    theme: '.tooltipster-shadow',
    animation: 'grow'
  });

  $tooltipsCheckbox.change(function() {
    changeToolTips($(this).is(":checked"));
  });

  retrieveFromStorage('tooltipsEnabled', function(enabled){
    console.log('storage: ' + enabled);
    if (enabled === undefined){
      enabled = true;
    }
    $tooltipsCheckbox.prop('checked', enabled);
    changeToolTips(enabled);
  });
}

function changeToolTips(enabled){
  $('.tutorial-tootlip').tooltipster(enabled ? 'enable' : 'disable');
  addSingleKeyToStorage('tooltipsEnabled', enabled, function(){});
}