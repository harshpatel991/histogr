function convertMinuteTimeToReadable(minutes){
    var hrs = Math.floor(minutes / 60);
    var mins = minutes % 60;
    var ap = 'am';
    if (hrs == 0){
        hrs = 12;
    }
    else if (hrs == 12){
        ap = 'pm';
    }
    else if (hrs > 12){
        ap = 'pm';
        hrs -= 12;
    }

    if (mins < 10){
        mins = '0' + mins;
    }
    return hrs + ':' + mins + ' ' + ap;
}

$(document).ready(function(){
    var params = location.search.split('?')[1].split('&');
    var blockedDomain = params[0].split('=')[1];
    var unblockTime = convertMinuteTimeToReadable(params[1].split('=')[1]);
    var blockedText = "The website <b>" + blockedDomain + "</b> is currently blocked by Histo.gr.";
    var unblockTimeText = "It will be unblocked at <b>" + unblockTime + "</b>.";
    $('#blockedSiteText').html(blockedText);
    $('#unblockTimeText').html(unblockTimeText);
});