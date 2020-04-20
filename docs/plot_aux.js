// Global variables that will be accessed in every
// function. The order of execution assures the
// proper assignment of each variable.
let svg;
let svgChart;
let dimensions;
let intervalId;
let startButton;
let callback;
let colorScale;
let completeCallbackChart = () => {};
let completeCallbackMap = () => {};

const completeCallback = () => {
    completeCallbackMap();
    completeCallbackChart();
}

// Variables related with the map
let index = 0;
let mapScale = 'translate(0, 50)';
let zooming = false;
let country = 'World';
let tooltipDiv;

// Variables related with the slider
let moving = false;
let timeScale;
let updateLabelDate;

// Buttons variables
let playPauseIcon;

// Chart variables
const chartDimensions = {
    width: 1050, height: 400, totalTop: 50,
    top: 10, right: 20, bottom: 30, left:45,
};
let callbackChart;
const chartAxis = {};

// General Variables, Mappings and Functions

let selectedVariable = 'confirmed';
const colorMapping = {
    confirmed: {
        mapColor: d3.schemeBlues[9],
        chartColor: '#08519c',
    },
    deaths: {
        mapColor: d3.schemeReds[9],
        chartColor: '#a50f15',
    },
    recovered: {
        mapColor: d3.schemeGreens[9],
        chartColor: '#006d2c',
    },
};

const legendMapping = {
    confirmed: 'Total de Casos Confirmados',
    deaths: 'Total de Óbitos',
    recovered: 'Total de Recuperações',
};

const radioOnClick = (radio) => {
    for (let item of radio.parentNode.children) {
        item.classList.remove('active');
    }
    radio.classList.add('active');
    selectedVariable = radio.getAttribute('name');
    
    // index = 0;
    updateColorScale();
    completeCallbackMap();
};

const startDate = new Date(2020, 0, 22);

const formatDateIntoYear = d3.timeFormat('%d %b %Y');
const formatDate = d3.timeFormat('%d %b %Y');
const parseDate = d3.timeParse('%m/%d/%y');

const path = d3.geoPath();

const updateColorScale = () => {
    colorScale = d3.scaleThreshold().domain([
        0, 1250, 2500, 3750, 5000, 6250, 7500, 8750, 10000
    ]).range(colorMapping[selectedVariable].mapColor);
};
updateColorScale();

const yesterday = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
};

const tomorrow = () => {
    const date = new Date(startDate.getTime());
    date.setDate(date.getDate() + index + 1);
    return date;
};

const getDateIndex = (date) => {
    const lengthOfDay = 24 * 60 * 60 * 1000;
    const firstDay = new Date(2020, 0, 22);
    const diff = Math.round(Math.abs((date - firstDay) / lengthOfDay));
    return diff;
};

const customTransform = (transformObj) => {
    const { x, y, k } = transformObj;
    const str = `translate(${x}, ${y + 50}) scale(${k})`;
    return str;
};

const checkAndRemoveTag = (tagname) => {
    const hasTag = d3.select(tagname)._groups[0][0] === null;
    if (hasTag !== null) {
        d3.select(tagname).remove();
    }
};

const update = (value, ignore=false) => {
    const oldIndex = index;
    index = getDateIndex(value);
    if (oldIndex !== index || ignore) {
        callback();
    }
};

const createMarker = (divId, textValue) => {
    checkAndRemoveTag(`.${divId}`);

    d3.select(`#${divId}`)
        .append('svg')
            .attr('class', `${divId}`)
            .attr('width', '100%')
            .attr('height', '30px')
        .append('text')
            .attr('class', 'marker')
            .attr('text-anchor', 'start')
            .text(`${textValue}`)
            .attr('font-size', '28px')
            .attr('font-family', 'CircularStd')
            .attr('transform', `translate(0, 25)`);
}

const updateMarkers = (chartData) => {
    const lastIndex = chartData[country] ? chartData[country].data.length -1 : undefined;
    const lastChart = lastIndex ? chartData[country].data[lastIndex] : undefined;
    const confirmed = lastChart ? lastChart.confirmed : '-';
    const deaths = lastChart ? lastChart.deaths : '-';
    const recovered = lastChart ? lastChart.recovered : '-';

    createMarker('confirmed-number', confirmed);
    createMarker('deaths-number', deaths);
    createMarker('recovered-number', recovered);
}

const endDate = yesterday();
