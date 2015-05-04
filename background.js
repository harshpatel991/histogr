var background_restrictedDomains = [];
var background_restrictedStartTimes = [];
var background_restrictedEndTimes = [];

background_updateRestrictedDomains();

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    console.log(message);
    background_updateRestrictedDomains();
});

function background_updateRestrictedDomains() {
    console.log('updating from storage');
    chrome.storage.local.get('restrictedDomains', function (val) {
        background_restrictedDomains = val['restrictedDomains'];
        chrome.storage.local.get('restrictedDomainsTimeFrom', function (val) {
            background_restrictedStartTimes = background_convertTimes(val['restrictedDomainsTimeFrom']);
            chrome.storage.local.get('restrictedDomainsTimeTo', function (val) {
                background_restrictedEndTimes = background_convertTimes(val['restrictedDomainsTimeTo']);
            });
        });
    });
}

function background_convertTimes(timesList){
    var convertedTimes = [];
    for (var i in timesList){
        var sepIdx = timesList[i].indexOf(':') + 3;
        var timeStr = timesList[i].substr(0,sepIdx) + " " + timesList[i].substr(sepIdx);
        var currDt = new Date("1-1-1970 " + timeStr);
        var currMins = currDt.getHours() * 60 + currDt.getMinutes();
        convertedTimes.push(currMins);
    }
    return convertedTimes;
}

function background_getDomainNameFromUrl(url){
    if (url.indexOf('https://')==-1 && url.indexOf('http://')==-1){
        return '';
    }
    var subs = url.split('/')[2].split('.');
    if (subs.length < 2){
        return '';
    }
    return subs[subs.length-2] + '.' + subs[subs.length-1];
}

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        var currDt = new Date();
        var currMins = currDt.getHours() * 60 + currDt.getMinutes();
        var domainName = background_getDomainNameFromUrl(details.url);
        for (var i  in background_restrictedDomains) {
            var shouldBlock = domainName.indexOf(background_restrictedDomains[i]) > -1 &&
                    currMins >= background_restrictedStartTimes[i] && currMins <= background_restrictedEndTimes[i];
            if (shouldBlock) {
                return {redirectUrl: chrome.extension.getURL('html/blocked_site.html?blockedUrl='+domainName+'&unblockTime='+background_restrictedEndTimes[i])};
            }
        }
        return {cancel: false};
    },
    {urls: ["<all_urls>"]},
    ["blocking"]);