//On clicking the timelline side bar button
$("#history-analysis-button").click(function () {
    $('#mainTabList a[href="#history-analysis"]').tab('show');
    fadeOutInToolBar();
    setTitleText("History Analysis", "An analysis of your history.");
});

$('input:radio[name=pieGraphOptions]').on('change', function () {
    console.log(this.value);
    pieGraphChangeDaySelector(this.value);
});


// Run when this tab is finished loading
$(function () {
    document.addEventListener('parse', function (value) {
        var parsedDomainHistory = value.detail.parsedDomainHistory;
        var entireHistoryVisits = value.detail.entireHistory;

        var barGraphData = getBarGraphData(parsedDomainHistory);
        var pieGraphData = getPieGraphData(entireHistoryVisits);
        createBarGraph(barGraphData);
        createPieGraph(pieGraphData);

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
});