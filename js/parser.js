var relationTimeSpan = 1000 * 60 * 15; //15 minutes
var goldenLinkRatio = 1.5;

function HistoryVisitItem(domainId, domainName, visitTime){
    this.domainId = domainId;
    this.domainName = domainName;
    this.visitTime = visitTime;
}

function DomainHistory(id, name) {
    this.id = id;
    this.name = name;
    this.domainType = 'other';
    this.outgoingLinks = [];
    this.incomingLinks = [];
    this.outgoingRelations = [];
    this.urlFreq = 0;
    this.linkFreq = 0;
    this.totalFreq = 0;
}

function linkDomains(srcDomain, destDomain){
    if (srcDomain.id == destDomain.id){
        return;
    }

    if (!srcDomain.outgoingLinks[destDomain.id]){
        srcDomain.outgoingLinks[destDomain.id] = 0;
    }
    srcDomain.outgoingLinks[destDomain.id]++;

    if (!destDomain.incomingLinks[srcDomain.id]){
        destDomain.incomingLinks[srcDomain.id] = 0;
    }
    destDomain.incomingLinks[srcDomain.id]++;
}

function getDomainNameFromUrl(url){
    if (url.indexOf('https://')==-1 && url.indexOf('http://')==-1){
        return '';
    }
    var subs = url.split('/')[2].split('.');
    if (subs.length < 2){
        return '';
    }
    return subs[subs.length-2] + '.' + subs[subs.length-1];
}

// Search history to find up to ten links that a user has typed in,
// and show those links in a popup.
function buildTypedUrlList(startTime, endTime, filter) {
    Spinner.show();
    var partialDomainHistory = {};
    var id = 0;
    entireHistory = [];
    parsedDomainHistory = [];

    // Track the number of callbacks from chrome.history.getVisits()
    // that we expect to get.  When it reaches zero, we have all results.
    var numRequestsOutstanding = 0;

    chrome.history.search({
            'text': '',              // Return every history item....
            'startTime': startTime,  // that was accessed less than one week ago.
            'endTime': endTime,  // that was accessed less than one week ago.
            'maxResults': 99999
        },
        function(historyItems) {
            // For each history item, get details on all visits.
            for (var i = 0; i < historyItems.length; ++i) {
                var url = historyItems[i].url;
                if (filter == 1 && searchEngineDomains.indexOf(getDomainNameFromUrl(url))>-1){
                    continue;
                }
                var processVisitsWithUrl = function(url) {
                    // We need the url of the visited item to process the visit.
                    // Use a closure to bind the  url into the callback's args.
                    return function(visitItems) {
                        processVisits(url, visitItems, startTime, endTime);
                    };
                };
                chrome.history.getVisits({url: url}, processVisitsWithUrl(url));
                numRequestsOutstanding++;
            }
            if (!numRequestsOutstanding) {
                retrieveFromStorage('distractingDomains', function(distractions){
                    for (var i = 0; i < distractions.length; i++){
                        var domainKey = distractions[i];
                        console.log(domainKey);
                        if (partialDomainHistory[domainKey] != undefined){
                            partialDomainHistory[domainKey].domainType = 'distraction';
                        }
                    }
                    onAllVisitsProcessed();
                });
            }
        });

    // Callback for chrome.history.getVisits().  Counts the number of
    // times a user visited a URL by typing the address.
    var processVisits = function(url, visitItems, startTime, endTime) {
        for (var i = 0; i < visitItems.length; ++i) {
            var visit = visitItems[i];
            if (visit.visitTime < startTime || visit.visitTime > endTime){
                continue;
            }
            var domain = getDomainNameFromUrl(url);
            if (domain == ''){
                continue;
            }
            if (!partialDomainHistory[domain]) {
                partialDomainHistory[domain] = new DomainHistory(id++, domain)
            }

            var newDomain = partialDomainHistory[domain];
            var newHistoryItem = new HistoryVisitItem(newDomain.id, domain, visit.visitTime);

            var typedTransitions = ['typed', 'auto_bookmark', 'generated', 'keyword', 'keyword_generated'];
            if (typedTransitions.indexOf(visit.transition)>-1) {
                newDomain.urlFreq++;
                entireHistory.push(newHistoryItem);
            }
            else if (visit.transition == 'link'){
                newDomain.linkFreq++;
                entireHistory.push(newHistoryItem);
            }
            else{
                entireHistory.push(newHistoryItem);
            }
        }

        // If this is the final outstanding call to processVisits(),
        // then we have the final results.  Use them to build the list
        // of URLs to show in the popup.
        if (!--numRequestsOutstanding) {
            retrieveFromStorage('distractingDomains', function(distractions){
                for (var i = 0; i < distractions.length; i++){
                    var domainKey = distractions[i];
                    console.log(domainKey);
                    if (partialDomainHistory[domainKey] != undefined){
                        partialDomainHistory[domainKey].domainType = 'distraction';
                    }
                }
                onAllVisitsProcessed();
            });
        }
    };

    // This function ients called when we have the final list of URls to display.
    var onAllVisitsProcessed = function() {
        entireHistory.sort(function(a,b){
            return a.visitTime - b.visitTime;
        });

        // Generate parsedDomainHistory
        var totalFreq = 0;
        parsedDomainHistory = [];
        for (var domainNameKey in partialDomainHistory){
            if (partialDomainHistory.hasOwnProperty(domainNameKey)){
                var historyItem = partialDomainHistory[domainNameKey];
                historyItem.totalFreq = historyItem.urlFreq + historyItem.linkFreq;
                parsedDomainHistory[historyItem.id] = historyItem;
                totalFreq += historyItem.totalFreq;
            }
        }

        // Find domain links
        var totalLinks = 0;
        var totalItems = parsedDomainHistory.length;
        for (var srcIdx = 0; srcIdx < entireHistory.length; srcIdx++){
            var srcVisit = entireHistory[srcIdx];
            var srcDomain = parsedDomainHistory[srcVisit.domainId];
            for (var destIdx = srcIdx + 1; destIdx < entireHistory.length; destIdx++){
                var destVisit = entireHistory[destIdx];
                var destDomain = parsedDomainHistory[destVisit.domainId];
                if (destVisit.visitTime > srcVisit.visitTime + relationTimeSpan){
                    break;
                }
                linkDomains(srcDomain, destDomain);
                totalLinks++;
            }
        }

        // Find domain relations
        for (i in parsedDomainHistory) {
            historyItem = parsedDomainHistory[i];
            for (j in historyItem.outgoingLinks) {
                var linkFreq = historyItem.outgoingLinks[j];
                if (linkFreq > goldenLinkRatio * totalLinks / totalItems) {
                    historyItem.outgoingRelations.push(j);
                    if (parsedDomainHistory[j].domainType === 'distraction') {
                        historyItem.domainType = 'trigger';
                    }
                }
            }
        }

        //TODO: Mark distraction sites based on given file
        //TODO: Find trigger sites: links between site and distraction site greater than average links per site
        //appendToStorage('title', 'hello', function(){});
        var parseEvent = document.createEvent('CustomEvent');
        parseEvent.initCustomEvent('parse', true, true, {'entireHistory':entireHistory, 'parsedDomainHistory':parsedDomainHistory});
        document.dispatchEvent(parseEvent);
        Spinner.hide();
    };
};

function Parser(){}

var entireHistory = [];
var parsedDomainHistory = [];
var searchEngineDomains = ['google.com','bing.com','yahoo.com','ask.com'];
Parser.parseHistoryFromSpan = function(startTime, endTime, filter){
    buildTypedUrlList(startTime, endTime, filter);
};
Parser.getEntireHistory = function(){
    return entireHistory;
};
Parser.getParsedDomainHistory = function(){
    return parsedDomainHistory;
};