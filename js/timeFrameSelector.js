$(function() { //position the time frame selector
    //$('.timeframe-selector').offset({ top: $('#title-bottom').offset().top+10 });
});

$(function() {
    $( "#custom-time-from" ).datepicker(); //initialize date picker
});

$(function() {
    $( "#custom-time-to" ).datepicker(); //initialize date picker
});

$("#domainfilter-select").change(function(){
    $("#timeframe-select").change();
});

$("#timeframe-select").change(function() {
    if ($('#timeframe-select').val() === 'custom') {
        $('#custom-time-frame').removeClass("display-none");
        $('#custom-time-from').val(""); //clear out the date boxes
        $('#custom-time-to').val("");
    }
    else {
        $('#custom-time-frame').addClass("display-none");
        var startDate = new Date();
        var endDate = new Date();
        startDate = new Date(startDate.setDate(endDate.getDate() - parseInt($('#timeframe-select').val())));

        timeFrameChange(startDate, endDate);
    }
});

$('#set-custom-timeframe').click(function () {
    var startDate = new Date ($('#custom-time-from').val());
    var endDate = new Date ($('#custom-time-to').val());
    timeFrameChange(startDate, endDate);
});

function timeFrameChange(startDate, endDate) {
    var filterVal = $('#domainfilter-select').val();
    console.log("Time frame has changed. Start date: " + startDate + " End date: " + endDate);
    Parser.parseHistoryFromSpan(startDate.getTime(), endDate.getTime(), filterVal);
}


function hideTimeFrameSelector() {
    $( ".timeframe-selector" ).addClass("display-none");
}

function showTimeFrameSelector() {
    $( ".timeframe-selector" ).removeClass("display-none")
}

function fadeOutInItem(selector, callback) {
    var fadeTime = 100;
    selector.fadeOut(fadeTime, function () {
        callback();
        selector.fadeIn(fadeTime);
    });
}
function fadeOutInToolBar() {
    fadeOutInItem($(".timeframe-selector"), function(){});
    fadeOutInItem($("#help-box-container"), function(){});
}
