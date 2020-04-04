const plot_legend = () => {
    checkAndRemoveTag('.legend-class');

    const legendDiv = d3.select('#legend')
        .append('svg')
        .attr('class', 'legend-class')
        .attr('width', dimensions.width)
        .attr('height', '50');

    const linearColor = d3.scaleLinear()
        .domain([0, 10000])
        .rangeRound([600, 850]);

    const g = legendDiv.append('g')
        .attr('class', 'key')
        .attr('transform', 'translate(100, 25)');

    g.selectAll('rect')
        .data(colorScale.range().map((d) => {
            const invD = colorScale.invertExtent(d);
            if (invD[0] == null) invD[0] = linearColor.domain()[0];
            if (invD[1] == null) invD[1] = linearColor.domain()[1];
            return invD;
        }))
        .enter()
            .append('rect')
            .attr('height', '8')
            .attr('x', d => linearColor(d[0]))
            .attr('width', d => linearColor(d[1]) - linearColor(d[0]))
            .attr('fill', d => colorScale(d[0]))
            .attr('stroke-width', 1.5)
            .attr('stroke', '#000');

    g.append("text")
        .attr("class", "caption")
        .attr("x", linearColor.range()[0])
        .attr("y", -6)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(legendMapping[selectedVariable]);
      
    g.call(d3.axisBottom(linearColor)
        .tickSize(13)
        .tickFormat(function(x, i) { return (i ? x : x + " casos"); })
        .tickValues(colorScale.domain()))
    .select(".domain")
        .remove();
}