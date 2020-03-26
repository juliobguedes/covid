const path = d3.geoPath();
const colorScale = d3.scaleThreshold().domain([
    0, 300, 600, 900, 1200, 1500, 1800, 2100
]).range(d3.schemeBlues[8]);

function ready(error, data) {
    if (error) throw error;

    const svg = d3.select('svg');
    const widtht = +svg.attr('width');
    const height = +svg.attr('height');

    console.log(data);

    const countries = data.features;
    svg.append('g')
            .attr('class', 'countries')
        .selectAll('path')
        .data(countries)
        .enter()
        .append('path')
            .attr('fill', (d) => {
                const confirmed = d.properties.confirmed;
                if (!confirmed) {
                    return '#e0e0eb';
                }
                const colorValue = confirmed[confirmed.length - 1];
                return colorScale(colorValue);
            })
            .attr('d', path)
            .append('title')
            .text(d => d.properties.COUNTRY);
}

d3.queue()
    .defer(d3.json, './data/covid_topo_features.json')
    .await(ready);