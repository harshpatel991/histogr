var relationTimeSpan = 1000 * 60 * 15; //15 minutes

function HistoryVisitItem(domainId, domainName, visitTime){
    this.domainId = domainId;
    this.domainName = domainName;
    this.visitTime = visitTime;
}

function DomainHistory(id, name, type) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.outgoingLinks = [];
    this.incomingLinks = [];
    this.urlFreq = 0;
    this.linkFreq = 0;
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

var entireHistory = [];
var parsedDomainHistory = {};

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
function buildTypedUrlList(granularity) {
    var partialDomainHistory = {};
    var id = 0;
    // To look for history items visited in the last week,
    // subtract a week of microseconds from the current time.
    var microsecondsInTimespan = 1000 * 60 * 60 * 24;
    if (granularity == 'week'){
        microsecondsInTimespan *= 7;
    }
    else if (granularity == 'month'){
        microsecondsInTimespan *= 30;
    }
    else if (granularity == 'year'){
        microsecondsInTimespan *= 365;
    }

    var endTime = (new Date).getTime();
    var startTime = endTime - microsecondsInTimespan;

    // Track the number of callbacks from chrome.history.getVisits()
    // that we expect to get.  When it reaches zero, we have all results.
    var numRequestsOutstanding = 0;

    chrome.history.search({
            'text': '',              // Return every history item....
            'startTime': startTime,  // that was accessed less than one week ago.
            'maxResults': 99999
        },
        function(historyItems) {
            // For each history item, get details on all visits.
            for (var i = 0; i < historyItems.length; ++i) {
                var url = historyItems[i].url;
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
                onAllVisitsProcessed();
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
                partialDomainHistory[domain] = new DomainHistory(id++, domain, 'other')
            }

            var newDomain = partialDomainHistory[domain];
            var newHistoryItem = new HistoryVisitItem(newDomain.id, domain, visit.visitTime);

            var typedTransitions = ['typed'];
            if (typedTransitions.indexOf(visit.transition)>-1) {
                newDomain.urlFreq++;
                entireHistory.push(newHistoryItem);
            }
            else if (visit.transition == 'link'){
                newDomain.linkFreq++;
                entireHistory.push(newHistoryItem);
            }
        }

        // If this is the final outstanding call to processVisits(),
        // then we have the final results.  Use them to build the list
        // of URLs to show in the popup.
        if (!--numRequestsOutstanding) {
            onAllVisitsProcessed();
        }
    };

    // This function ients called when we have the final list of URls to display.
    var onAllVisitsProcessed = function() {
        entireHistory.sort(function(a,b){
            return a.visitTime - b.visitTime;
        });

        parsedDomainHistory = [];
        for (var domainNameKey in partialDomainHistory){
            if (partialDomainHistory.hasOwnProperty(domainNameKey)){
                var historyItem = partialDomainHistory[domainNameKey];
                parsedDomainHistory[historyItem.id] = historyItem;
            }
        }

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
            }
        }
    };
}

buildTypedUrlList('day');