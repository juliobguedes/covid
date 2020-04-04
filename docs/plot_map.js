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
        .attr('class', 'country-path')
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
        .on('click', (d) => {
            country = d.properties.COUNTRY;
            completeCallbackChart();
        })
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)
        .on('mousemove', mouseMove);
};

const mouseOver = (d) => {
    moving = true;
    tooltipDiv.style('display', 'inline');
};

const mouseOut = (d) => {
    moving = false;
    tooltipDiv.style('display', 'none');
};

const mouseMove = (d) => {
    const singleCase = !d.properties.country ? null : d.properties.confirmed[index] === 1;
    const text = !d.properties.country
        ? `Country: ${d.properties.COUNTRY}. No data was provided.`
        : `Country: ${d.properties.COUNTRY}. In ${d.properties.dates[index]},
        this country had reported ${d.properties.confirmed[index]} confirmed case${singleCase ? '' : 's'},
        ${d.properties.deaths[index]} cases of death, and ${d.properties.recovered[index]}
        cases of recovery`;
    tooltipDiv.text(text)
        .style("left", `${d3.event.pageX + dimensions.margin / 3}px`)
        .style("top", `${d3.event.pageY - 12}px`);
}

const zoom_actions = () => {
    zooming = true;
    const transform = d3.event.transform;
    mapScale = transform ? customTransform(transform) : mapScale;
    d3.selectAll('.country-path').attr('transform', transform);
};

const zoom_handler = d3.zoom()
    .on('zoom', zoom_actions);
