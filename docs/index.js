const ready = (error, data) => {
    if (error) throw error;

    const svg = d3.select('svg');
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const dimensions = { width, height, margin: 50 };
    const callback = () => plotMap(svg, data, dimensions);
    createSlider(svg, dimensions, callback);
}

d3.queue()
    .defer(d3.json, './data/covid_topo_features.json')
    .await(ready);