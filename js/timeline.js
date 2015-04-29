//On clicking the timelline side bar button
$("#timeline-button").click(function() {
    $('#mainTabList a[href="#timeline"]').tab('show');
    showTimeFrameSelector();
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
    //return 5;
    //return Math.random()*10;
    return date.getUTCHours() * 60 + date.getUTCMinutes();
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


	clearGraph();

    var rev_data = [];
    
     for (var i = 0; i < data.length; i++) {
        var obj = data[i];
        var d = new Date(obj.visitTime);

        rev_data.push({
            x: d.getTime()/1000,
            y: getDayMinutes(d),
            z: obj.domainName
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
            return new Date(x*1000).toLocaleDateString();
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
		formatter:function(series, x, y, z){
			return searchSeries(series.data, x);
			//return z;
		}
	} );

    

    xAxis.render();
    yAxis.render();
    graph.render();


    
    

   

    

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

	

    graph.renderer.dotSize = 3;

	//previewXAxis.render();
    graph.render();
  
}