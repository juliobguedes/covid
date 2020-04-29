const plot_chart_upd = (data) => {
    checkAndRemoveTag('.chart-upd');

    const chartDim = { height: 400, width: 900, mwl: 70, mwr: 15, mh: 25 };

    const chartData = data[country].data.filter(v => v.confirmed > 0).map(v => {
        if (typeof v.date !== 'object') v.date = getStrDate(v.date);
        return v;
    });

    const firstCase = new Date(chartData[0].date.getTime());
    firstCase.setDate(firstCase.getDate() - 2);

    chartXAxis = d3.scaleTime()
        .domain([firstCase, endDate])
        .range([chartDim.mwl, chartDim.width - chartDim.mwl - chartDim.mwr])
        .clamp(true);

    const maxValue = () => Math.max.apply(Math, chartData.map(d => d.confirmed));
    const bottom = -1 * maxValue() / 20;

    chartYAxis = d3.scaleLinear()
        .domain([bottom, maxValue()])
        .range([chartDim.height - chartDim.mh, chartDim.mh]);

    const g = d3.select('#chart-vis-upd')
        .append('svg')
            .attr('class', 'chart-upd')
            .attr('width', chartDim.width)
            .attr('height', chartDim.height)
        .append('g');

    getDoublingLine(chartData, 1, maxValue(), g, '#9ecae1');
    getDoublingLine(chartData, 2, maxValue(), g, '#9ecae1');
    getDoublingLine(chartData, 4, maxValue(), g, '#9ecae1');
    getDoublingLine(chartData, 7, maxValue(), g, '#9ecae1');

    plotLine(g, chartData, 'recovered', 'green');
    plotLine(g, chartData, 'deaths', 'orange');
    plotLine(g, chartData, 'confirmed', 'blue');

    g.append('g')
        .attr('transform', `translate(0, ${chartDim.height - chartDim.mh})`)
        .call(d3.axisBottom(chartXAxis));

    g.append('g')
        .attr('transform', `translate(${chartDim.mwl}, 0)`)
        .call(d3.axisLeft(chartYAxis));


    g.append('text')
        .attr('class', 'x-label')
        .attr('transform', 'translate(785, 370)')
        .text(languageMapping.legend.xLabel[language]);

    g.append('text')
        .attr('class', 'y-label')
        .attr('transform', 'translate(80, 35)')
        .text(languageMapping.legend.yLabel[language]);
};

const getDoublingLine = (data, mod, max, g, color) => {
    let doubleData = [...data];
    let flag = true;

    doubleData = doubleData.filter((d, i) => i % mod === 0);
    doubleData = doubleData.map((d, i) => {
        let double = Math.pow(2, i);
        if (double <= max || flag) {
            if (double > Math.min(max, double)) {
                double = max;
                flag = false;
            }
            d.double = double;
        };
        return d;
    });
    doubleData = doubleData.filter(d => d.double);
    console.log(doubleData);
    plotLine(g, doubleData, 'double', color, dots=false);
};

const plotLine = (g, data, variable, color, dots=true) => {
    const x = chartXAxis;
    const y = chartYAxis;

    if (dots) {
        g.selectAll('dot')
            .data(data)
            .enter()
            .append('circle')
                .attr('fill', color)
                .attr('r', '3')
                .attr('cx', (d) => x(d.date))
                .attr('cy', (d) => y(d[variable]));
    }

    g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', dots ? 1 : 2)
        .attr('d', d3.line()
            .x((d) => x(d.date))
            .y((d) => y(d[variable]))
            .curve(d3.curveMonotoneX)
        );
};
