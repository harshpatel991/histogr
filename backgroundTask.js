chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        return {cancel: details.url.indexOf("reddit.com") != -1};
    },
    {urls: ["<all_urls>"]},
    ["blocking"]);