//Regular expression for time validation taken
// courtesy of http://www.the-art-of-web.com/javascript/validate-date/

//On clicking the banlist side bar button, refresh the lists
$("#banlist-button").click(function() {
    $('#mainTabList a[href="#banlist"]').tab('show');
    $('#openTutorialLink').attr('data-slide-to', '7');
    listRestrictedDomains();
    fadeOutInToolBar();
    setTitleText("Blocked Sites", "Manage websites from being visited", "This tab lists out the websites that you have banned as well allows you to manage your distraction websites.");
});

$('#restricted-domain-from').timepicker(); //initialize datepickers
$('#restricted-domain-to').timepicker();

$("#submit-restricted").click(addRestrictedDomain);
$("#submit-distracting").click(addDistractingDomainFromTextBox);

$('#distracting-domain').select2({
    placeholder: 'Add Distraction URL'
});

$('#restricted-domain').select2({
    placeholder: 'Add Restricted URL'
});



$(function () {
    document.addEventListener('parse', function (value) {
        changeSelectOptions(value.detail.parsedDomainHistory);
    });

    document.addEventListener('reparseUpdate', function (value) {
        changeSelectOptions(value.detail.parsedDomainHistory);
    });
});

function changeSelectOptions(domainHistory){
    domainHistory = domainHistory.slice(0).sort(function(a,b){return a.name.localeCompare(b.name);});
    var restrictOptHtml = '<option></option>';
    var distractionOptHtml = '<option></option>';
    for (var i in domainHistory){
        var historyItem = domainHistory[i];
        restrictOptHtml += '<option>' + historyItem.name + '</option>';
        if (historyItem.domainType != 'distraction'){
            distractionOptHtml += '<option>' + historyItem.name + '</option>';
        }
    }
    $('#distracting-domain').html(distractionOptHtml);
    $('#restricted-domain').html(restrictOptHtml);
}


//Called when clicking restricted domain button
function addRestrictedDomain() {
    $('#banlist-error-box').html("");//clear out error box

    var urlToBlock = $('#restricted-domain').val();
    var timeFrom = $('#restricted-domain-from').val();
    var timeTo = $('#restricted-domain-to').val();

    var timeRegExp = /^\d{1,2}:\d{2}([ap]m)?$/;

    if(urlToBlock != '' && timeFrom != '' && timeFrom.match(timeRegExp) && timeTo != '' && timeTo.match(timeRegExp)) {

        $('#restricted-domain').select2("val", ""); //clear the box
        $('#restricted-domain-from').val("");
        $('#restricted-domain-to').val("");

        //Add to storage and afterwards refresh the list of domains
        appendToStorage("restrictedDomains", urlToBlock, function () {
            appendToStorage("restrictedDomainsTimeFrom", timeFrom, function () {
                appendToStorage("restrictedDomainsTimeTo", timeTo, function () {
                    chrome.runtime.sendMessage('backgroundUpdate');
                    console.log("saved: " + timeFrom + timeTo);
                    listRestrictedDomains();
                });
            });
        });
    }
    else if (urlToBlock === '') {
        $('#banlist-error-box').html('<div class="alert alert-danger" role="alert">Please enter a domain</div>');
    }
    else {
        console.log("error!");
        $('#banlist-error-box').html('<div class="alert alert-danger" role="alert">Please enter valid times (ex 1:45pm)</div>');
    }

}

//List out the saved restricted domains on the page
function listRestrictedDomains() {
    $("#restricted-domains-list").empty(); //clear any domains on the page

    retrieveFromStorage("restrictedDomains", function(items) { //get domains from storage
        retrieveFromStorage("restrictedDomainsTimeFrom", function(restrictedFrom) { //get timeFrom from storage
            console.log("got from storage restrictedFrom: " + restrictedFrom);
            retrieveFromStorage("restrictedDomainsTimeTo", function(restrictedTo) { //get timeTo from storage

                console.log(items);
                if(items !== undefined) {
                    for (var index = 0; index < items.length; index++) {
                        $("#restricted-domains-list").append(items[index] + ' <b>From: </b>' + restrictedFrom[index] + ' <b>To:</b> ' + restrictedTo[index] +'<button class="btn btn-danger pull-right" id="delete-restricted-' + index +'"><span class="glyphicon glyphicon-trash"></span> Delete</button><br><hr>');
                        $("#delete-restricted-"+index).click(deleteRestrictedDomain(index));
                    }
                }
            });
        });
    });
}


function deleteRestrictedDomain(index) {
    return function () {
        pruneFromStorage("restrictedDomains", index, function() {
            pruneFromStorage("restrictedDomainsTimeFrom", index, function() {
                pruneFromStorage("restrictedDomainsTimeTo", index, function() {
                    chrome.runtime.sendMessage('backgroundUpdate');

                        listRestrictedDomains();
                });
            });
        });
    }
}

