$(function() {
    $( "#custom-time-from" ).datepicker(); //initialize date picker
});

$(function() {
    $( "#custom-time-to" ).datepicker(); //initialize date picker
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
        endDate = new Date(endDate.setDate(startDate.getDate() + parseInt($('#timeframe-select').val())));

        timeFrameChange(startDate, endDate);
    }
});

$('#set-custom-timeframe').click(function () {
    var startDate = new Date ($('#custom-time-from').val());
    var endDate = new Date ($('#custom-time-to').val());
    timeFrameChange(startDate, endDate);
});

function timeFrameChange(startDate, endDate) {

    console.log("Time frame has changed. Start date: " + startDate + " End date: " + endDate);


}