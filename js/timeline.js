//On clicking the timelline side bar button
$("#timeline-button").click(function() {
    $('#mainTabList a[href="#timeline"]').tab('show');
    fadeOutInToolBar();
    setTitleText("Timeline", "Your history in order of its visitation", "TODO: TIMELINE");
});

$(function() {
    document.addEventListener('parse', function(value) {
    	current_history_data = value.detail.entireHistory;
        generateTimeline(value.detail.entireHistory);
    });
});

var graph = null;
var current_history_data;

function getDayMinutes(date) {
    return date.getHours() * 60 + date.getMinutes();
}

function getTimeString(d) {
    //return "";
    hour = Math.round(d / 60);
    minutes = d % 60;
    if (hour > 12) {
        hour = hour % 12;
        return (hour < 10 ? "0" + hour : hour) + ":" + (minutes < 10 ? minutes + "0" : minutes) + " PM";
    }
    return (hour < 10 ? "0" + hour : hour) + ":" + (minutes < 10 ? minutes + "0" : minutes) + " AM"
}

function clearGraph(){

	$('#timeline-container').html(
    '<div id="preview" style="margin-top:10px;"></div><div id="timeline-chart"></div>'
  );
}

function searchSeries(series, x){
	for(var i = 0; i<series.length; i++ ){
		if(series[i].x == x){
			return series[i].z;
		}
	}
}

function generateTimeline(data) {
    $(window).off('resize');

	clearGraph();

    var rev_data = {distraction: [], trigger: [], other: []};

     for (var i = 0; i < data.length; i++) {
        var obj = data[i];
        var d = new Date(obj.visitTime);

         rev_data[obj.domainType].push({
            x: d.getTime()/1000,
            y: getDayMinutes(d),
            z: obj.domainName
        });
    }

    var width = "1400",
        height = "750";

    var graphSeries = [];
    if (rev_data['other'].length > 0){
        graphSeries.push({color: CustomColors.other, data: rev_data['other'], name: 'Other'});
    }
    if (rev_data['distraction'].length > 0){
        graphSeries.push({color: CustomColors.distraction, data: rev_data['distraction'], name: 'Distraction'});
    }
    if (rev_data['trigger'].length > 0){
        graphSeries.push({color: CustomColors.trigger, data: rev_data['trigger'], name: 'Trigger'});
    }

    var graph = new Rickshaw.Graph({
        element: document.getElementById("timeline-chart"),
        width: width,
        height: height,
        renderer: 'scatterplot',
        series: graphSeries
    });

    var xAxis = new Rickshaw.Graph.Axis.X({
        graph: graph,
        tickFormat: function(x) {
            return new Date(x*1000).toLocaleDateString();
        }
    });

    var yAxis = new Rickshaw.Graph.Axis.Y({
        graph: graph,
        tickFormat: function(y) {
            return getTimeString(y);
        }
    });

    var hoverDetail = new Rickshaw.Graph.HoverDetail( {
		graph: graph,
		formatter:function(series, x, y, z){
			return searchSeries(series.data, x);
			//return z;
		}
	} );

    xAxis.render();
    yAxis.render();

    var preview = new Rickshaw.Graph.RangeSlider( {
		graph: graph,
		color: "#9253a0",
		element: document.getElementById('preview'),
		tickFormat: function(x) {
            return new Date(x).toLocaleDateString();
        }
		}
	);

    graph.renderer.dotSize = 3;
    graph.render();

    function resizeTimeline() {
        graph.configure({
            width: $('#timeline').width() - 150,
            height: $('#mainTabList').height() - 300
        });

        $('#preview').width($('#timeline').width() - 150);
        graph.render();
    }

    $(window).on('resize', function(){
        resizeTimeline();
    });

    resizeTimeline();
}