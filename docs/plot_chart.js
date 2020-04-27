const plot_chart = (data, chartVar, pos) => {
    checkAndRemoveTag(`.chart-${chartVar}`);

    const plotSvg = svgChart.append('g')
        .attr('class', `chart-${chartVar}`)
        .attr('transform', `translate(${chartDimensions.left}, ${chartDimensions.top})`);

    const widthStart = (pos * chartDimensions.width / 3) + 10;
    const widthEnd = (pos + 1) * chartDimensions.width / 3 - chartDimensions.right * 2.5;
    const xAmplitude = widthEnd - widthStart;
    const height = chartDimensions.height - chartDimensions.top -
        chartDimensions.bottom - chartDimensions.totalTop;

    const chartData = data[country] ? data[country].data : [];

    const maxValue = () => Math.max.apply(Math, chartData.map(d => d[chartVar]));

    chartAxis[chartVar] = {
        x: d3.scaleTime()
            .domain([startDate, endDate])
            .range([widthStart, widthEnd]),
        y: d3.scaleLinear()
            .domain([0, maxValue()])
            .range([height, chartDimensions.bottom])
    };

    plotSvg.selectAll(`.chart-${chartVar}`)
        .data(chartData)
        .enter()
        .append('rect')
            .attr('x', d => chartAxis[chartVar].x(new Date(d.date)))
            .attr('y', d => chartAxis[chartVar].y(d[chartVar]) - chartDimensions.bottom)
            .attr('fill', colorMapping[chartVar].chartColor)
            .attr('width', (xAmplitude / chartData.length) * 0.6)
            .attr('height', d => height - chartAxis[chartVar].y(d[chartVar]));

    plotSvg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${height - chartDimensions.bottom})`)
        .call(d3.axisBottom(chartAxis[chartVar].x))
            .selectAll('text')
            .attr('transform', 'translate(0, 0) rotate(-45)')
            .style('text-anchor', 'end');

    plotSvg.append('g')
        .attr('transform', `translate(${widthStart}, ${-chartDimensions.bottom})`)
        .call(d3.axisLeft(chartAxis[chartVar].y));

    plotSvg.append("text")
        .attr("transform", `translate(${widthStart + chartDimensions.left}, -10) rotate(0)`)
        .text(languageMapping.legend[chartVar][language]);
};


const chart_ready = (error, data) => {
    if (error) throw error;

    completeCallbackChart = () => {
        updateMarkers(data);
        checkAndRemoveTag('.chart')
        const chartSvg = d3.select('#chart-vis')
            .append('svg')
                .attr('class', 'chart')
                .attr('width', chartDimensions.width)
                .attr('height', chartDimensions.height);

        const headerLabel = language === 'pt' ? 'Dados de' : 'Data from';

        chartSvg.append('text')
            .attr('transform', `translate(${chartDimensions.width / 2}, 25)`)
            .text(`${headerLabel} ${country}`);

        svgChart = chartSvg.append('g')
            .attr('transform', `translate(0, ${chartDimensions.totalTop})`);

        plot_chart(data, 'confirmed', 0);
        plot_chart(data, 'deaths', 1);
        plot_chart(data, 'recovered', 2);
    };
    completeCallbackChart();
}


d3.queue()
    .defer(d3.json, './data/covid_chart.json')
    .await(chart_ready);