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
        createAllGraphs(value.detail.parsedDomainHistory, value.detail.entireHistory);
    });

    document.addEventListener('reparseUpdate', function (value) {
        createAllGraphs(value.detail.parsedDomainHistory, value.detail.entireHistory);
    });

    function createAllGraphs(domainHistory, entireHistoryVisits){
        createBarGraph(getBarGraphData(domainHistory));
        createPieGraph(getPieGraphData(entireHistoryVisits));
        createLineGraph(getLineGraphData(entireHistoryVisits));
        createDataPanels(getDomainPanelData(domainHistory));
    }

    function createDataPanels(domainData){
        var uniqueHtml = '<span class="glyphicon glyphicon glyphicon-stop type-distraction">Distraction: '+domainData.uniqueData.distraction+'</span><br>';
        uniqueHtml += '<span class="glyphicon glyphicon glyphicon-stop type-trigger">Trigger: '+domainData.uniqueData.trigger+'</span><br>';
        uniqueHtml += '<span class="glyphicon glyphicon glyphicon-stop type-other">Other: '+domainData.uniqueData.other+'</span>';
        $('#uniqueTotalsPanel').html(uniqueHtml);

        var visitHtml = '<span class="glyphicon glyphicon glyphicon-stop type-distraction">Distraction: '+domainData.visitData.distraction+'</span><br>';
        visitHtml += '<span class="glyphicon glyphicon glyphicon-stop type-trigger">Trigger: '+domainData.visitData.trigger+'</span><br>';
        visitHtml += '<span class="glyphicon glyphicon glyphicon-stop type-other">Other: '+domainData.visitData.other+'</span>';
        $('#visitTotalsPanel').html(visitHtml);
    }

    function getDomainPanelData(domainHistory){
        var uniqueData = {distraction: 0, trigger: 0, other: 0};
        var visitData = {distraction: 0, trigger: 0, other: 0};

        for (var i in domainHistory){
            uniqueData[domainHistory[i].domainType]++;
            visitData[domainHistory[i].domainType] += domainHistory[i].totalFreq;
        }
        return {uniqueData: uniqueData, visitData: visitData};
    }

    function getBarGraphData(origData) {
        var groupData = [];
        origData = origData.slice(0).sort(function (a, b) {
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