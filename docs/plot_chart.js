const plot_chart = (data, chartVar, pos) => {
    
    console.log(data)
    checkAndRemoveTag(`.chart-${chartVar}`);

    const plotSvg = svgChart.append('g')
        .attr('class', `chart-${chartVar}`)
        .attr('transform', `translate(${chartDimensions.left}, ${chartDimensions.top})`);

    const widthStart = (pos * chartDimensions.width / 3) + 10;
    const widthEnd = (pos + 1) * chartDimensions.width / 3 - chartDimensions.right * 2.5;
    const xAmplitude = widthEnd - widthStart;
    const height = chartDimensions.height - chartDimensions.top -
        chartDimensions.bottom - chartDimensions.totalTop;

    const chartData = data.data ? data.data : [];
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
        .attr("transform", `translate(${widthStart + chartDimensions.left}, 0) rotate(0)`)
        .text(legendMapping[chartVar]);
};


const chart_ready = (error, data) => {
    if (error) throw error;
    
    loadComboboxCountries(data)
    var countryCombo = document.getElementById("countryCombo");
    const country = countryCombo.options[countryCombo.selectedIndex].value;
    console.log(country)
    
    completeCallbackChart = () => {
        checkAndRemoveTag('.chart')
        const chartSvg = d3.select('#chart-vis')
            .append('svg')
                .attr('class', 'chart')
                .attr('width', chartDimensions.width)
                .attr('height', chartDimensions.height);

        chartSvg.append('text')
            .attr('transform', `translate(${chartDimensions.width / 2}, 25)`)
            .text(`Data from ${country}`)

        svgChart = chartSvg.append('g')
            .attr('transform', `translate(0, ${chartDimensions.totalTop})`);

        plot_chart(data[country], 'confirmed', 0);
        plot_chart(data[country], 'deaths', 1);
        plot_chart(data[country], 'recovered', 2);

        
    };
    completeCallbackChart();
}

const loadChart = () => {
    d3.queue()
    .defer(d3.json, './data/covid_chart.json')
    .await(chart_ready);
}

loadChart()
