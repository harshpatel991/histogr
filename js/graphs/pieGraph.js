var pieGraphData = [];
var chart = '';
var pieGraphDayTitles = ['All', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function createPieGraph(data){
    pieGraphData = data;
    $('.analysis-chart-pie').html('');
    chart = c3.generate({
        bindto: '.analysis-chart-pie',
        size: {
            height: 240,
            width: 480
        },
        data: {
            columns: [
                ['Distraction', pieGraphData['distraction'][0]],
                ['Trigger', pieGraphData['trigger'][0]],
                ['Other', pieGraphData['other'][0]]
            ],
            colors: {
                Distraction: CustomColors.distraction,
                Trigger: CustomColors.trigger,
                Other: CustomColors.other
            },
            type : 'donut'
        },
        donut: {
            title: pieGraphDayTitles[0]
        }
    });

    pieGraphChangeDaySelector($('input:radio[name=pieGraphOptions]:checked').val());
}

function pieGraphChangeDaySelector(selector){
    chart.load({
        columns: [
            ['Distraction', pieGraphData['distraction'][selector]],
            ['Trigger', pieGraphData['trigger'][selector]],
            ['Other', pieGraphData['other'][selector]]
        ]
    });
    $('.c3-chart-arcs-title').html(pieGraphDayTitles[selector]);
}