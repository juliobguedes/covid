const plotMap = (data) => {
    const countries = data.features;

    const hasCountries = d3.select('.countries')._groups[0][0] === null;
    if (hasCountries !== null) {
        d3.select('.countries').remove();
    }

    svg.append('g')
            .attr('class', 'countries')
            .attr('transform', mapScale)
        .selectAll('path')
        .data(countries)
        .enter()
        .append('path')
        .attr('fill', (d) => {
            const confirmed = d.properties.confirmed;
            if (!confirmed) {
                return '#c0c0c0';
            }
            const colorValue = confirmed[index];
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
