//On clicking the timelline side bar button
$("#distractions-analysis-button").click(function() {
    $('#mainTabList a[href="#distractions-analysis"]').tab('show');
    $('#openTutorialLink').attr('data-slide-to', '6');
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
    $('#distracting-domain').on('change',function(){
        console.log($(this).val());
        addDistractingDomainFromTextBox();
    });

});

function createAccordion(domainHistory) {
    retrieveFromStorage('distractingDomains', function(items) {
        var div = document.getElementById("accordion");
        $(div).html("")
        for (i = 0; i < items.length; i++){
            bodyString = getDomainData(domainHistory, items[i]);
            $(div).append('<div class="panel panel-primary" style="border-color: #ccc"><div class="panel-heading" style="background-color: #eeeeee; color: #333;"><button class="btn btn-danger btn-xs pull-right" id="delete-distracting-' + i + '"><span class="glyphicon glyphicon-trash"></span> Delete</button><h4 class="panel-title"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span><a data-toggle="collapse" data-parent="#accordion" href="#collapse'+i+'"> '+items[i]+'</a></h4></div><div id="collapse'+i+'" class="panel-collapse collapse"><div class="panel-body" id='+items[i]+'>'+bodyString+'</div></div></div>');
            $("#delete-distracting-" + i).click(deleteDistractingDomain(i, true));
        }
        $('.panel').on('show.bs.collapse', function(){
            var arrow = $(this).find('.glyphicon');
            arrow.toggleClass('glyphicon-chevron-right glyphicon-chevron-down');
        }).on('hidden.bs.collapse', function(){
            var arrow = $(this).find('.glyphicon');
            arrow.toggleClass('glyphicon-chevron-down glyphicon-chevron-right');
        });
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
    for (var i = 0; i < neighbors.length && i<5; i++)
    {
        returnString+=neighbors[i].name+": "+neighbors[i].val+" times <br />"
    }
    if(neighbors.length == 0)
        returnString = '<font size = "5">No visits to this website.</font> <br />'
    return returnString;
}

//Called when clicking distracting domain button
function addDistractingDomainFromTextBox() {
    $('#banlist-error-box').html("");//clear out error box

    var urlMarkAsDistracting = $('#distracting-domain').val();

    if(urlMarkAsDistracting != '') {
        $('#distracting-domain').select2("val", ""); //clear the box
        Parser.isDirty = true;
        addDistractingDomain(urlMarkAsDistracting, true);
    }
    else {
        $('#banlist-error-box').html('<div class="alert alert-danger" role="alert">Please enter a domain</div>');
    }
}

function addDistractingDomain(domain, shouldReparse) {
    console.log("adding distracting domain: " + domain);
    appendToStorage("distractingDomains", domain, function () {
        if (shouldReparse){
            console.log('here');
            Parser.reparseDomainTypes(true);
        }
        //listDistractingDomains(); //TODO: replace with something
    });
}


function deleteDistractingDomain(index, shouldReparse) {
    return function () {
        Parser.isDirty = true;

        pruneFromStorage("distractingDomains", index, function() {
            if (shouldReparse){
                Parser.reparseDomainTypes(true);
            }
            //listDistractingDomains();
        });
    }
}