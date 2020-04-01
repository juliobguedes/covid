
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

    svg = d3.select('#map').select('svg');
    zoom_handler(svg);
    startButton = d3.select('#start-button');
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    dimensions = { width, height, margin: 50 };
    callback = () => plotMap(data);
    createSlider();
    plot_legend();

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
    .defer(d3.json, './data/covid_topo_features.json')
    .await(ready);