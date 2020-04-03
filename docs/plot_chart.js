const plot_chart = (data) => {
    svgChart.append('g')
        .attr('transform', `translate(${chartDimensions.left}, ${chartDimensions.top})`);

    const width = chartDimensions.width - chartDimensions.left - chartDimensions.right;
    const height = chartDimensions.height - chartDimensions.top - chartDimensions.bottom;

    const chart_data = data[country];
    xAxisScale = d3.scaleLinear();

    svgChart.selectAll('g')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => reposicionaEmX(d.noventa_percentil))
            .attr('cy', d => reposicionaEmY(d.dez_percentil))
            .attr('fill', d => preenchimento(d.mediana))
            .attr('r', 3);

    svgChart.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    svgChart.append('g')
        .attr('transform', 'translate(0,0)')
        .call(d3.axisLeft(y));

    svgChart.append("text")
        .attr("transform", "translate(-30," + (chartHeight + chartDimensions.top)/2 + ") rotate(-90)")
        .text("10-percentil");
}


const chart_ready = (error, data) => {
    if (error) throw error;

    svgChart = d3.select('#chart-vis')
        .append('svg')
            .attr('width', chartDimensions.width)
            .attr('height', chartDimensions.height)
        .append('g');

    plot_chart(data);
}


d3.queue()
    .defer(d3.json, './data/covid_chart.json')
    .await(chart_ready);