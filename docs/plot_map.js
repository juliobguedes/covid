const plotMap = (data) => {
    const countries = data.features;

    checkAndRemoveTag('.countries');

    svg.append('g')
            .attr('class', 'countries')
            .attr('transform', mapScale)
        .selectAll('path')
        .data(countries)
        .enter()
        .append('path')
        .attr('fill', (d) => {
            const variable = d.properties[selectedVariable];
            if (!variable) {
                return '#c0c0c0';
            }
            const colorValue = variable[index];
            if (colorValue === 0) {
                return '#fff';
            }
            return colorScale(colorValue);
        })
        .attr('d', path)
        .on('click', (d) => { country = d.properties.COUNTRY; })
        .append('title')
        .text(d => d.properties.COUNTRY)
};

const zoom_actions = () => {
    zooming = true;
    const transform = d3.event.transform;
    mapScale = transform ? customTransform(transform) : mapScale;
    d3.selectAll('path').attr('transform', transform);
};

const zoom_handler = d3.zoom()
    .on('zoom', zoom_actions);
