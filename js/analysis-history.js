//On clicking the timelline side bar button
$("#history-analysis-button").click(function() {
    $('#mainTabList a[href="#history-analysis"]').tab('show');
    fadeOutInToolBar();
    setTitleText("History Analysis", "An analysis of your history.");
});

$('.pieGraph-btn').on('click', function(){
    pieGraphChangeDaySelector(this.value);
});


// Run when this tab is finished loading
$(function(){
    document.addEventListener('parse', function(value){
        var parsedDomainHistory = value.detail.parsedDomainHistory;
        var entireHistoryVisits = value.detail.entireHistory;
        parsedDomainHistory.sort(function(a,b){return b.totalFreq - a.totalFreq});
        var slicedHistory = parsedDomainHistory.slice(0,20);
        //frame.contentWindow.onParse(slicedHistory);
        createBarGraph(slicedHistory);
        barGraph(entireHistoryVisits);

    });

    function barGraph(historyVisits){
        var graphData = [];
        graphData['distraction'] = [0,0,0,0,0,0,0,0];
        graphData['trigger'] = [0,0,0,0,0,0,0,0];
        graphData['other'] = [0,0,0,0,0,0,0,0];
        for (var i in historyVisits){
            var visit = historyVisits[i];
            graphData[visit.domainType][0]++;
            var visitDate = new Date(visit.visitTime);
            graphData[visit.domainType][visitDate.getDay()+1]++;
        }
        console.log(graphData);
        createPieGraph(graphData);
    }
});