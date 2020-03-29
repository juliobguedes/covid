// Global variables that will be accessed in every
// function. The order of execution assures the
// proper assignment of each variable.
let svg;
let dimensions;
let intervalId;
let startButton;
let callback;

// Variables related with the map
let index = 0;

// Variables related with the slider
let moving = false;
let sliderCurrentValue;
let sliderTargetValue;
let slider;
let handle;
let label;
let timeScale;


const startDate = new Date('2020-01-22');

const formatDateIntoYear = d3.timeFormat('%d %b %Y');
const formatDate = d3.timeFormat('%d %b %Y');
const parseDate = d3.timeParse('%m/%d/%y');

const path = d3.geoPath();

const colorScale = d3.scaleThreshold().domain([
    0, 300, 600, 900, 1200, 1500, 1800, 2100, 2400, 2700
]).range(d3.schemeBlues[9]);

const yesterday = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
};

const getDateIndex = (date) => {
    const lengthOfDay = 24 * 60 * 60 * 1000;
    const firstDay = new Date('2020-01-22');
    const diff = Math.round(Math.abs((date - firstDay) / lengthOfDay));
    return diff;
};

const endDate = yesterday();
