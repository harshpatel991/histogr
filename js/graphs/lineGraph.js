var lineGraphData = [];
var lineChart = '';
var lineGraphDayTitles = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function createLineGraph(data){
    lineGraphData = data;
    generateLineGraph(data.hours);
}

function generateLineGraph(data) {
    $('.analysis-chart-line').html('');
    lineChart = c3.generate({
        bindto: '.analysis-chart-line',
        size: {
            height: 240,
            width: 800
        },
        data: {
            json: data,
            keys: {
                value: ['distraction', 'trigger', 'other']
            },
            colors: {
                distraction: CustomColors.distraction,
                trigger: CustomColors.trigger,
                other: CustomColors.other
            }
        },


        axis: {
            x: {
                type: 'category'
            }
        }
    });
}

function lineGraphChange(selector) {
    generateLineGraph(lineGraphData[selector]);
}