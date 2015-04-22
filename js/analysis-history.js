$(document).ready(function(){
    $('iframe').each(function(i, frame){
        document.addEventListener('parse', function(value){
            var parsedDomainHistory = value.detail.parsedDomainHistory;
            parsedDomainHistory.sort(function(a,b){return b.totalFreq - a.totalFreq});
            var slicedHistory = parsedDomainHistory.slice(0,20);
            frame.contentWindow.onParse(slicedHistory);
        });
    });
});