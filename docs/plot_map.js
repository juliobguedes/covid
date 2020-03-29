const plotMap = (data) => {
    const countries = data.features;
    svg.append('g')
            .attr('class', 'countries')
            .attr('transform', 'translate(0, 50)')
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
                return colorScale(colorValue);
            })
            .attr('d', path)
            .append('title')
            .text(d => d.properties.COUNTRY);
};