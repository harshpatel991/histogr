//On clicking the timelline side bar button
$("#timeline-button").click(function() {
    $('#mainTabList a[href="#timeline"]').tab('show');
    showTimeFrameSelector();
});

$(function () {
    document.addEventListener('parse', function (value) {
        generateTimeline(value.detail.parsedDomainHistory)
    });
});




function generateTimeline(data){
	
	var graph = new Rickshaw.Graph( {
	element: document.getElementById("timeline-chart"),
	width: 500,
	height: 250,
	renderer: 'scatterplot',
	series: [
		{
			color: "#ff9030",
			data: data
		}
	]
} );
}