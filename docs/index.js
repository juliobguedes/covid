
const startBtn = () => {
    playPauseIcon.text(() => '\uf04c')
        .attr('transform', 'translate(100, 44)');
    moving = true;
    intervalId = setInterval(step, 500);
}

const stopBtn = () => {
    playPauseIcon.text(() => '\uf04b')
        .attr('transform', 'translate(102, 44)');
    moving = false;
    clearInterval(intervalId);
}

const step = () => {
    const nextDay = tomorrow();
    if (nextDay > endDate) return;
    update(nextDay);
    if (index === getDateIndex(endDate)) {
        stopBtn();
    }
};

const ready = (error, data) => {
    index = data.features[0].properties.confirmed.length - 1;
    if (error) throw error;

    const width = 1000;
    const height = 600;

    svg = d3.select('#map')
        .append('svg')
        .attr('id', 'map-svg')
        .attr('width', width)
        .attr('height', height);
    
    startButton = d3.select('#start-button');
    dimensions = { width, height, margin: 50 };

    tooltipDiv = d3.select('#map-vis')
        .append('div')
        .attr('class', 'tooltip')
        .style('display', 'none')

    completeCallbackMap = () => {
        timeScale = d3.scaleTime()
            .domain([startDate, endDate])
            .range([0, getDateIndex(endDate)])
            .clamp(true);

        callback = () => {
            plotMap(data);
            updateLabelDate();
        };
        plot_legend();
        update(timeScale.invert(index), ignore=true);
    };

    completeCallbackMap();
}

const chart_ready = (error, data) => {
    if (error) throw error;

    completeCallbackChart = () => {
        checkAndRemoveTag('.chart')
        plot_chart_upd(data);
        updateMarkers(data);
    };
    completeCallbackChart();
}


d3.queue()
    .defer(d3.json, './data/covid_chart.json')
    .await(chart_ready);

d3.queue()
    .defer(d3.json, './data/covid_topo_features.json')
    .await(ready);