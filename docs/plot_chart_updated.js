const plot_chart_upd = (data) => {
    const chartDim = { height: 400, width: 900, mwl: 70, mwr: 15, mh: 25 };

    const chartData = data[country].data.filter(v => v.confirmed > 0).map(v => {
        v.date = getStrDate(v.date);
        return v;
    });

    const firstCase = new Date(chartData[0].date.getTime());
    firstCase.setDate(firstCase.getDate() - 2);

    const xAxisScale = d3.scaleTime()
        .domain([firstCase, endDate])
        .range([chartDim.mwl, chartDim.width - chartDim.mwl - chartDim.mwr])
        .clamp(true);

    const maxValue = () => Math.max.apply(Math, chartData.map(d => d.confirmed));

    const yAxisScale = d3.scaleLinear()
        .domain([-1e5, maxValue()])
        .range([chartDim.height - chartDim.mh, chartDim.mh]);

    const g = d3.select('#chart-vis-upd')
        .append('svg')
            .attr('width', chartDim.width)
            .attr('height', chartDim.height)
        .append('g');

    g.selectAll('dot')
        .data(chartData)
        .enter()
        .append('circle')
            .attr('fill', 'green')
            .attr('r', '3')
            .attr('cx', (d) => xAxisScale(d.date))
            .attr('cy', (d) => yAxisScale(d.recovered));

    g.selectAll('dot')
        .data(chartData)
        .enter()
        .append('circle')
            .attr('fill', 'red')
            .attr('r', '3')
            .attr('cx', (d) => xAxisScale(d.date))
            .attr('cy', (d) => yAxisScale(d.deaths));

    g.selectAll('dot')
        .data(chartData)
        .enter()
        .append('circle')
            .attr('fill', 'blue')
            .attr('r', '3')
            .attr('cx', (d) => xAxisScale(d.date))
            .attr('cy', (d) => yAxisScale(d.confirmed));

    g.append('g')
        .attr('transform', `translate(0, ${chartDim.height - chartDim.mh})`)
        .call(d3.axisBottom(xAxisScale));

    g.append('g')
        .attr('transform', `translate(${chartDim.mwl}, 0)`)
        .call(d3.axisLeft(yAxisScale));

    const mouseG = g.append('g')
        .attr('class', 'mouse-over-effects');

    mouseG.append('path') // this is the black vertical line to follow mouse
        .attr('class', 'mouse-line')
        .style('stroke', 'black')
        .style('stroke-width', '1px')
        .style('opacity', '1');

    // g.selectAll(``)
    //     .data(chartData)
    //     .enter()
    //     .append('rect')
    //         .attr('x', d => chartAxis[chartVar].x(new Date(d.date)))
    //         .attr('y', d => chartAxis[chartVar].y(d[chartVar]) - chartDimensions.bottom)
    //         .attr('fill', colorMapping[chartVar].chartColor)
    //         .attr('width', (xAmplitude / chartData.length) * 0.6)
    //         .attr('height', d => height - chartAxis[chartVar].y(d[chartVar]));
}