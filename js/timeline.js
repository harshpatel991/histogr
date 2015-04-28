//On clicking the timelline side bar button
$("#timeline-button").click(function() {
    $('#mainTabList a[href="#timeline"]').tab('show');
    showTimeFrameSelector();
});

$(function() {
    document.addEventListener('parse', function(value) {
        generateTimeline(value.detail.entireHistory)
    });
});


function getDayMinutes(date) {
    return date.getUTCHours() * 60 + date.getUTCMinutes();
}

function getTimeString(d) {
    hour = Math.round(d / 60);
    minutes = d % 60;
    if (hour > 12) {
        hour = hour % 12;
        return (hour < 10 ? "0" + hour : hour) + ":" + (minutes < 10 ? minutes + "0" : minutes) + " PM";
    }
    return (hour < 10 ? "0" + hour : hour) + ":" + (minutes < 10 ? minutes + "0" : minutes) + " AM"
}

function clearGraph(){
	$('#timeline-container').empty();
	$('#timeline-container').html(
    '<div id="preview" style="margin-top:10px;"></div><div id="timeline-chart"></div>'
  );
}

function generateTimeline(data) {


	clearGraph();

    var rev_data = [];

    for (var i = 0; i < data.length; i++) {
        var obj = data[i];
        var d = new Date(obj.visitTime);

        rev_data.push({
            x: d.getTime(),
            y: getDayMinutes(d)
        });

    }




    var graph = new Rickshaw.Graph({
        element: document.getElementById("timeline-chart"),
        width: 700,
        height: 450,
        renderer: 'scatterplot',
        series: [{
            color: "#9253a0",
            data: rev_data
        }]
    });

    var xAxis = new Rickshaw.Graph.Axis.X({
        graph: graph,
        tickFormat: function(x) {
            return new Date(x).toLocaleDateString();
        }
    })

    var yAxis = new Rickshaw.Graph.Axis.Y({
        graph: graph,
        tickFormat: function(y) {
            return getTimeString(y);
        }
    })

    var hoverDetail = new Rickshaw.Graph.HoverDetail( {
            graph: graph,
            xFormatter: function(x) {
				return new Date(x).toLocaleDateString();
			}
        } );

    xAxis.render();
    yAxis.render();
    graph.render();


    var annotator = new Rickshaw.Graph.Annotate({
        graph: graph,
        element: document.getElementById('timeline-chart')
    });

    

    for (var i = 0; i < data.length; i++) {
        var obj = data[i];
        var d = new Date(obj.visitTime);

        annotator.add(d.getTime(), obj.domainName)

    }

    var preview = new Rickshaw.Graph.RangeSlider( {
		graph: graph,
		color: "#9253a0",
		element: document.getElementById('preview'),
		tickFormat: function(x) {
            return new Date(x).toLocaleDateString();
        }
		} 
	);

   /* var previewXAxis = new Rickshaw.Graph.Axis.Time({
		//graph: preview.previews[0],
		graph: graph,
		//timeFixture: new Rickshaw.Fixtures.Time.Local(),
		//ticksTreatment: ticksTreatment
	});*/

	

    graph.renderer.dotSize = 6;

	//previewXAxis.render();
    graph.render();
  
}