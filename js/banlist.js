//On clicking the banlist side bar button, refresh the lists
$("#banlist-button").click(function() {
    $('#mainTabList a[href="#banlist"]').tab('show')
    listRestrictedDomains();
    listDistractingDomains();
});

$("#submit-restricted").click(addRestrictedDomain);
$("#submit-distracting").click(addDistractingDomainFromTextBox);

//Called when clicking restricted domain button
function addRestrictedDomain() {
    var urlToBlock = $('#restricted-domain').val();

    $('#restricted-domain').val(""); //clear the box

    //Add to storage and refresh the list of domains
    appendToStorage("restrictedDomains", urlToBlock, function () {
        listRestrictedDomains();
    });
}

//Called when clicking distracting domain button
function addDistractingDomainFromTextBox() {
    var urlMarkAsDistracting = $('#distracting-domain').val();
    $('#distracting-domain').val(""); //clear the box
    addDistractingDomain(urlMarkAsDistracting);
}

function addDistractingDomain(domain) {
    console.log("adding distracting domain: " + domain);
    appendToStorage("distractingDomains", domain, function () {
        listDistractingDomains();
    });
}

//List out the saved restricted domains on the page
function listRestrictedDomains() {
    $("#restricted-domains-list").empty(); //clear any domains on the page

    retrieveFromStorage("restrictedDomains", function(items) { //get domains from storage
        console.log(items);
        if(items !== undefined) {
            for (var index = 0; index < items.length; index++) {
                $("#restricted-domains-list").append(items[index] + '<button id="delete-restricted-' + index +'">Delete</button><br>');
                $("#delete-restricted-"+index).click(deleteRestrictedDomain(index));
            }
        }
    });
}

function listDistractingDomains() {
    $("#distracting-domains-list").empty(); //clear any domains on the page

    retrieveFromStorage("distractingDomains", function(items) { //get domains from storage
        if(items !== undefined) {
            for (var index = 0; index < items.length; index++) {
                $("#distracting-domains-list").append(items[index] + '<button id="delete-distracting-' + index + '">Delete</button><br>');
                $("#delete-distracting-" + index).click(deleteDistractingDomain(index));
            }
        }
    });
}

function deleteRestrictedDomain(index) {
    return function () {
        console.log("deleting restricted index: " + index);
        pruneFromStorage("restrictedDomains", index, function() {listRestrictedDomains();});
    }
}

function deleteDistractingDomain(index) {
    return function () {
        console.log("deleting distracting index: " + index);
        pruneFromStorage("distractingDomains", index, function() {listDistractingDomains();});
    }
}