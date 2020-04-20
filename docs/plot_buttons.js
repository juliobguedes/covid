const plot_buttons = (div) => {
    const g = div.append('g')
        .attr('class', 'transition-buttons');

    const playPauseBtn = g.append('circle')
        .attr('class', 'playPauseBtn svgBtns')
        .attr('transform', 'translate(100, 37)')
        .attr('r', '20')
        .on('click', playPauseButton);

    playPauseIcon = g.append('text')
        .attr('transform', `translate(${!moving ? 102 : 100}, 44)`)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'FontAwesome')
        .attr('font-size', '20px')
        .attr('cursor', 'pointer')
        .attr('fill', 'white')
        .on('click', playPauseButton)
        .text(!moving ? '\uf04b' : '\uf04c');

    const previousBtn = g.append('circle')
        .attr('class', 'previousBtn svgBtns')
        .attr('transform', 'translate(63, 42)')
        .attr('r', '15')
        .on('click', previousButton);

    g.append('text')
        .attr('transform', 'translate(62, 48)')
        .attr('text-anchor', 'middle')
        .attr('font-family', 'FontAwesome')
        .attr('font-size', '16px')
        .attr('cursor', 'pointer')
        .attr('fill', 'white')
        .on('click', previousButton)
        .text(() => '\uf060');

    const nextBtn = g.append('circle')
        .attr('class', 'nextBtn svgBtns')
        .attr('transform', 'translate(137, 42)')
        .attr('r', '15')
        .on('click', nextButton);

    g.append('text')
        .attr('transform', 'translate(138, 48)')
        .attr('text-anchor', 'middle')
        .attr('font-family', 'FontAwesome')
        .attr('font-size', '16px')
        .attr('cursor', 'pointer')
        .attr('fill', 'white')
        .on('click', nextButton)
        .text(() => '\uf061');

    updateLabelDate = () => {
        checkAndRemoveTag('.label-date');

        const formattedDate = exibitDate(timeScale.invert(index));
        const formattedIndex = parseInt(index) + 1;

        g.append('text')
            .attr('class', 'label-date')
            .attr('transform', 'translate(270, 53)')
            .attr('text-anchor', 'middle')
            .attr('font-family', 'CircularStd')
            .attr('font-size', '16px')
            .attr('cursor', 'pointer')
            .text(`Dia: ${formattedIndex} de ${timeScale(endDate) + 1}. ${formattedDate}.`)
    }
};

const playPauseButton = () => {
    const text = playPauseIcon.text();
    if (text === '\uf04b') {
        startBtn();
    } else {
        stopBtn();
    }
}

const previousButton = () => {
    index -= 2;
    if (index < 0) {
        index = -1;
    }
    step();
}

const nextButton = () => {
    step();
}
