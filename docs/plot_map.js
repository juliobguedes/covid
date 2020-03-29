var index = 0;

const plotMap = (svg, data, dimensions) => {
    console.log(index);
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
                const colorValue = confirmed[index];
                return colorScale(colorValue);
            })
            .attr('d', path)
            .append('title')
            .text(d => d.properties.COUNTRY);
};