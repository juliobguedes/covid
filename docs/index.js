
const startBtn = () => {
    moving = true;
    if (sliderCurrentValue >= dimensions.width - dimensions.margin) {
        // this resets the slider if it has reached the end before
        index = -1;
        sliderCurrentValue = 50;
    }
    intervalId = setInterval(step, 1000);
    startButton.text('Pause');
}

const stopBtn = () => {
    moving = false;
    clearInterval(intervalId);
    startButton.text('Start');
}

const step = () => {
    if (zooming) {
        zooming = false;
        return;
    }

    const nextDay = tomorrow()
    sliderCurrentValue = timeScale(nextDay);
    update(nextDay);

    if (sliderCurrentValue >= (dimensions.width - dimensions.margin)) {
        stopBtn();
    }
};

const ready = (error, data) => {
    if (error) throw error;

    const width = 1000;
    const height = 600;

    mapsData = data;

    svg = d3.select('#map')
        .append('svg')
        .attr('id', 'map-svg')
        .attr('width', width)
        .attr('height', height);

    // svg.call(zoom_handler);
    
    startButton = d3.select('#start-button');
    dimensions = { width, height, margin: 50 };

    tooltipDiv = d3.select('#map-vis')
        .append('div')
        .attr('class', 'tooltip')
        .style('display', 'none')

    completeCallbackMap = () => {
        callback = () => plotMap(data[countryName]);
        limit = countryName === 'World' ? 10000 : 2000;
        mapScale = countryName === 'World'? mapScale : 'translate(0, 0)';
        updateColorScale();
        createSlider();
        plot_legend();
    };

    completeCallbackMap();

    startButton.on('click', () => {
        const btnLabel = startButton.text();
        if (btnLabel === 'Pause') {
            stopBtn();
        } else {
            startBtn();
        }
    });
}

d3.queue()
    .defer(d3.json, './data/topo_features.json')
    .await(ready);