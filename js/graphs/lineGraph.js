var lineGraphData = [];
var lineChart = '';
var lineGraphDayTitles = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function createLineGraph(data){
    lineGraphData = data;
    generateLineGraph(data.hours, 'hours');
}

function generateLineGraph(data, selector) {
    $('.analysis-chart-line').html('');
    var xLabel = selector == 'hours' ? 'Hour of Day' : 'Day of Week';
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
                type: 'category',
                label: xLabel
            },
            y: {
                label: '# of Visits'
            }
        },

        tooltip: {
            format: {
                title: function(d) {
                    return selector == 'days' ? lineGraphDayTitles[d] : d; }
            }
        }
    });

    var $tooltip = $('.c3-tooltip > tbody > tr > th');
    $tooltip.text(lineGraphDayTitles[0]);
    if (selector == 'days'){
        fixDaysOfWeek();
    }

    function fixDaysOfWeek(){
        $('.c3-axis-x > g > text > tspan').each(function(){
            var dayText = lineGraphDayTitles[$(this).text()];
            $(this).text(dayText);
        });
    }
}

function lineGraphChange(selector) {
    generateLineGraph(lineGraphData[selector], selector);
}