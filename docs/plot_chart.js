const plot_chart = (data) => {
    checkAndRemoveTag('.chart')

    svgChart = d3.select('#chart-vis')
        .append('svg')
            .attr('class', 'chart')
            .attr('width', chartDimensions.width)
            .attr('height', chartDimensions.height)
        .append('g');

    svgChart.append('g')
        .attr('transform', `translate(${chartDimensions.left}, ${chartDimensions.top})`);

    const width = chartDimensions.width - chartDimensions.left - chartDimensions.right;
    const height = chartDimensions.height - chartDimensions.top - chartDimensions.bottom;

    const chartData = data[country].data;

    const maxValue = () => Math.max.apply(Math, chartData.map(d => d[selectedVariable]));

    xAxisScale = d3.scaleTime()
        .domain([startDate, endDate])
        .range([chartDimensions.left * 2.5, width + chartDimensions.left]);

    yAxisScale = d3.scaleLinear()
        .domain([0, maxValue()])
        .range([height, 0]);

    svgChart.selectAll('g')
        .data(chartData)
        .enter()
        .append('rect')
            .attr('x', d => xAxisScale(new Date(d.date)))
            .attr('y', d => yAxisScale(d[selectedVariable]))
            .attr('fill', colorMapping[selectedVariable].chartColor)
            .attr('width', (width / chartData.length) * 0.8)
            .attr('height', d => height - yAxisScale(d[selectedVariable]));

    svgChart.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xAxisScale))
            .selectAll('text')
            .style('text-anchor', 'end');

    svgChart.append('g')
        .attr('transform', `translate(${chartDimensions.left * 2.5}, 0)`)
        .call(d3.axisLeft(yAxisScale));

    svgChart.append("text")
        .attr("transform", `translate(${chartDimensions.left}, ${(chartDimensions.height) / 1.66}) rotate(-90)`)
        .text(legendMapping[selectedVariable]);
}


const chart_ready = (error, data) => {
    if (error) throw error;

    completeCallbackChart = () => plot_chart(data);
    completeCallbackChart();
}


d3.queue()
    .defer(d3.json, './data/covid_chart.json')
    .await(chart_ready);