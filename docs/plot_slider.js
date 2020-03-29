var moving = false;

const createSlider = (svg, dimensions, callback) => {
    let sliderCurrentValue = dimensions.margin;
    const sliderTargetValue = dimensions.width - dimensions.margin;

    const timeScale = d3.scaleTime()
        .domain([startDate, endDate])
        .range([dimensions.margin, sliderTargetValue])
        .clamp(true);

    const slider = svg.append('g')
        .attr('class', 'slider')
        .attr('transform', `translate(0, ${dimensions.height - dimensions.margin})`);

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
                update(invTime, handle, label, timeScale, callback);
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
    
    const handle = slider.insert('circle', '.track-overlay')
        .attr('class', 'handle')
        .attr('r', 9);
    
    const label = slider.append('text')
        .attr('class', 'label')
        .attr('text-anchor', 'middle')
        .text(formatDate(startDate))
        .attr('transform', `translate(0, ${-25})`);

    update(new Date('2020-01-22'), handle, label, timeScale, callback, ignore=true);
};

const update = (value, handle, label, timeScale, callback, ignore=false) => {
    handle.attr('cx', timeScale(value));
    label.attr('x', timeScale(value))
        .text(formatDate(value));

    const oldIndex = index;
    index = getDateIndex(value);
    if (oldIndex !== index || ignore) {
        callback();
    }
};
