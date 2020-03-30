const createSlider = () => {

    const sliderdiv = d3.select('#slider')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', '100');

    sliderCurrentValue = dimensions.margin;
    sliderTargetValue = dimensions.width - dimensions.margin;

    timeScale = d3.scaleTime()
        .domain([startDate, endDate])
        .range([dimensions.margin, sliderTargetValue])
        .clamp(true);

    slider = sliderdiv.append('g')
        .attr('class', 'slider')
        .attr('transform', `translate(0, 50)`);

    slider.append('line')
        .attr('class', 'track')
        .attr('x1', timeScale.range()[0])
        .attr('x2', timeScale.range()[1])
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr('class', 'track-inset')
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr('class', 'track-overlay')
        .call(d3.drag()
            .on('start.interrupt', () => { slider.interrupt(); })
            .on('start drag', () => {
                sliderCurrentValue = d3.event.x;
                const invTime = timeScale.invert(sliderCurrentValue);
                update(invTime);
            })
        );

    slider.insert('g', '.track-overlay')
        .attr('class', 'ticks')
        .attr('transform', `translate(0, ${18})`)
      .selectAll('text')
        .data(timeScale.ticks(10))
        .enter()
        .append('text')
        .attr('x', timeScale)
        .attr('y', 10)
        .attr('text-anchor', 'middle')
        .text(d => formatDateIntoYear(d));
    
    handle = slider.insert('circle', '.track-overlay')
        .attr('class', 'handle')
        .attr('r', 9);
    
    label = slider.append('text')
        .attr('class', 'label')
        .attr('text-anchor', 'middle')
        .text(formatDate(startDate))
        .attr('transform', `translate(0, ${-25})`);

    update(new Date(2020, 00, 22), ignore=true);
};

const update = (value, ignore=false) => {
    handle.attr('cx', timeScale(value));
    label.attr('x', timeScale(value))
        .text(formatDate(value));

    const oldIndex = index;
    index = getDateIndex(value);
    if (oldIndex !== index || ignore) {
        callback();
    }
};
