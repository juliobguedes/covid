
const startBtn = () => {
    moving = true;
    intervalId = setInterval(step, 1000);
    startButton.text('Pause');
}

const stopBtn = (reset=false) => {
    moving = false;
    if (reset) sliderCurrentValue = 0;
    clearInterval(intervalId);
    startButton.text('Start');
}

const step = () => {
    if (zooming) {
        zooming = false;
        return;
    }
    const yst = yesterday();
    const totalDays = getDateIndex(yst);
    update(timeScale.invert(sliderCurrentValue));
    sliderCurrentValue += (dimensions.width - dimensions.margin) / totalDays;
    if (sliderCurrentValue > (dimensions.width - dimensions.margin)) {
        stopBtn(true);
    }

    console.log(sliderCurrentValue);
};

const ready = (error, data) => {
    if (error) throw error;

    svg = d3.select('svg');
    zoom_handler(svg);
    startButton = d3.select('#start-button');
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    dimensions = { width, height, margin: 50 };
    callback = () => plotMap(data);
    createSlider();
    plot_legend();

    startButton.on('click', () => {
        console.log('btn clicked');
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