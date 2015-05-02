//On clicking the timelline side bar button
$("#distractions-analysis-button").click(function() {
    $('#mainTabList a[href="#distractions-analysis"]').tab('show');
    fadeOutInToolBar();
    setTitleText("Distractions Analysis", "An analysis of your distracting websites.", "This tab displays detailed info about all of your selected distractions.");
});
$(document).ready(function(){
    document.addEventListener('parse', function (value) {
        createAccordion(value.detail.parsedDomainHistory)
    });
    document.addEventListener('reparseUpdate', function (value) {
        createAccordion(value.detail.parsedDomainHistory)
    });
});

function createAccordion(domainHistory) {
    retrieveFromStorage('distractingDomains', function(items) {
        var div = document.getElementById("accordion")
        $(div).html("")
        for (i = 0; i < items.length; i++){
            bodyString = getDomainData(domainHistory, items[i])
            $(div).append('<div class="panel panel-primary"><div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#collapse'+i+'">'+items[i]+'</a></h4></div><div id="collapse'+i+'" class="panel-collapse collapse"><div class="panel-body" id='+items[i]+'>'+bodyString+'</div></div></div>')
        }
    });
}

function getDomainData(domainHistory, domainName){
    var graphData = {nodes: [], links: []};
    var totalItems = domainHistory.length;
    var neighbors = new Array();
    var returnString = '<font size = "5">Visited from the following domains </font> <br />'
    for (var i = 0; i < totalItems; i++) {
        var historyItem = domainHistory[i];
        if(historyItem.name != domainName)
            continue;
        else
            for (j in historyItem.incomingLinks){
                //console.log(domainHistory[j].name)
                //console.log(historyItem.incomingLinks[j])
                neighbors.push({name: domainHistory[j].name, val: historyItem.incomingLinks[j]});
            }
        break;
    }
    neighbors.sort(function(a,b) {
        return b.val - a.val
    });
    for (var i = 0; i < neighbors.length; i++)
    {
        returnString+=neighbors[i].name+": "+neighbors[i].val+" times <br />"
    }
    if(neighbors.length == 0)
        returnString = "No visits to this website."
    return returnString;
}
