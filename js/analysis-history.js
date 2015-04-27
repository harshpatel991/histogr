//On clicking the timelline side bar button
$("#history-analysis-button").click(function() {
    $('#mainTabList a[href="#history-analysis"]').tab('show')
});


// Run when this tab is finished loading
$(function(){
    $('iframe').each(function(i, frame){
        document.addEventListener('parse', function(value){
            var parsedDomainHistory = value.detail.parsedDomainHistory;
            parsedDomainHistory.sort(function(a,b){return b.totalFreq - a.totalFreq});
            var slicedHistory = parsedDomainHistory.slice(0,20);
            frame.contentWindow.onParse(slicedHistory);
        });
    });
});