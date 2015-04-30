//On clicking the timelline side bar button
$("#history-analysis-button").click(function () {
    $('#mainTabList a[href="#history-analysis"]').tab('show');
    fadeOutInToolBar();
    setTitleText("History Analysis", "An analysis of your history.");
});

$('input:radio[name=pieGraphOptions]').on('change', function () {
    pieGraphChangeDaySelector(this.value);
});

$('input:radio[name=lineGraphOptions]').on('change', function () {
    lineGraphChange(this.value);
});


// Run when this tab is finished loading
$(function () {
    document.addEventListener('parse', function (value) {
        var parsedDomainHistory = value.detail.parsedDomainHistory;
        var entireHistoryVisits = value.detail.entireHistory;

        createBarGraph(getBarGraphData(parsedDomainHistory));
        createPieGraph(getPieGraphData(entireHistoryVisits));
        createLineGraph(getLineGraphData(entireHistoryVisits));
    });

    function getBarGraphData(origData) {
        var groupData = [];
        origData.sort(function (a, b) {
            return b.totalFreq - a.totalFreq
        });
        var totalCount = 0,
            distractionCount = 0,
            triggerCount = 0;
        for (var i in origData) {
            if (distractionCount == 15) {
                break;
            }

            if (origData[i].domainType == 'distraction') {
                groupData.push(origData[i]);
                distractionCount++;
                groupData[totalCount].graphIdx = totalCount++;
            }
        }

        for (i in origData) {
            if (triggerCount == 15) {
                break;
            }

            if (origData[i].domainType == 'trigger') {
                groupData.push(origData[i]);
                triggerCount++;
                groupData[totalCount].graphIdx = totalCount++;
            }
        }

        for (i in origData) {
            if (totalCount == 45) {
                break;
            }

            if (origData[i].domainType == 'other') {
                groupData.push(origData[i]);
                groupData[totalCount].graphIdx = totalCount++;
            }
        }
        return groupData;
    }


    function getPieGraphData(historyVisits) {
        var graphData = [];
        graphData['distraction'] = [0, 0, 0, 0, 0, 0, 0, 0];
        graphData['trigger'] = [0, 0, 0, 0, 0, 0, 0, 0];
        graphData['other'] = [0, 0, 0, 0, 0, 0, 0, 0];
        for (var i in historyVisits) {
            var visit = historyVisits[i];
            graphData[visit.domainType][0]++;
            var visitDate = new Date(visit.visitTime);
            graphData[visit.domainType][visitDate.getDay() + 1]++;
        }
        return graphData;
    }

    /*function getLineGraphData(historyVisits){
        var daysData = [];
        daysData['distraction'] = [];
        daysData['trigger'] = [];
        daysData['other'] = [];

        var hoursData = [];
        hoursData['distraction'] = [];
        hoursData['trigger'] = [];
        hoursData['other'] = [];

        for (var i = 0; i < 7; i++){
            daysData['distraction'][i] = 0;
            daysData['trigger'][i] = 0;
            daysData['other'][i] = 0;
        }

        for (i = 0; i < 24; i++){
            hoursData['distraction'][i] = 0;
            hoursData['trigger'][i] = 0;
            hoursData['other'][i] = 0;
        }

        for (i in historyVisits) {
            var visit = historyVisits[i];
            var visitDate = new Date(visit.visitTime);
            hoursData[visit.domainType][visitDate.getHours()]++;
            daysData[visit.domainType][visitDate.getDay()]++;
        }

        return daysData;
    }*/

    function getLineGraphData(historyVisits){
        var daysData = [];
        var hoursData = [];

        for (var i = 0; i < 7; i++){
            daysData.push({distraction: 0, trigger: 0, other: 0});
        }

        for (i = 0; i < 24; i++){
            hoursData.push({distraction: 0, trigger: 0, other: 0});
        }

        for (i in historyVisits) {
            var visit = historyVisits[i];
            var visitDate = new Date(visit.visitTime);
            hoursData[visitDate.getHours()][visit.domainType]++;
            daysData[visitDate.getDay()][visit.domainType]++;
        }

        return {days: daysData, hours: hoursData};
    }
});