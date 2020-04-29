let language = 'pt';

const languageMapping = {
    change: {
        pt: '🇬🇧 English Version',
        en: '🇧🇷 Versão em Português',
    },
    p1: {
        pt: `Caso você esteja visualizando num celular ou algum outro dispositivo móvel,
        recomendo que habilite a rotação de tela, coloque o dispositivo na horizontal, e
        recarregue a página. As visualizações são interativas: colocar o mouse acima ou
        clicar num país mostra dados que não estão visíveis de imediato.`,
        en: `If you are seeing this in a mobile device or a cellphone, I strongly recommend
        put your device in the horizontal mode and reload the page. The visualizations have
        interactions: hovering and clicking in countries will show data not immediately visible.`
    },
    p2: {
        pt: `O site ainda está em desenvolvimento. Fique a vontade para contribuir,
        melhorando o nosso conteúdo, ou fornecendo novas fontes de dados.`,
        en: `The website is still in development. Feel free to contribute, improving
        the content, or suggesting new data sources.`
    },
    p3: {
        pt: `Os dados que estamos usando foram obtidos
        <a href="https://data.humdata.org/dataset/novel-coronavirus-2019-ncov-cases">pelo site</a>
        e pelo
        <a href="https://github.com/CSSEGISandData/COVID-19">repositório no GitHub</a>
        da universidade Johns Hopkins, nos Estados Unidos. O código é
        <a href="https://github.com/juliobguedes/covid">Open Source</a>.
        Sinta-se livre e encorajado para sugerir adições, modificações, abrir issues, pull
        requests, ou entrar em contato.`,
        en: `The datasets were obtained from the Johns Hopkins University
        <a href="https://data.humdata.org/dataset/novel-coronavirus-2019-ncov-cases">website</a>
        and <a href="https://github.com/CSSEGISandData/COVID-19">GitHub repository</a>. The code
        <a href="https://github.com/juliobguedes/covid">is Open Source</a>.
        Feel free and encouraged to suggest additions, modifications, open issues,
        pull requests, or to contact.`
    },
    p4: {
        pt: `Os dados desta página estão sendo atualizados manualmente todos os dias,
        através dos scripts contidos no repositório. Assim, é possível que,
        pouco após meia noite ou durante a madrugada, a página ainda esteja
        desatualizada.`,
        en: `The data is being manually updated every day, using the scripts in the
        repository. It ss possible that the data is outdated, which means
        that it will not contain information about the day before you are seeing it.`
    },
    p5: {
        pt: `Se você está interessado em dados do Brasil, recomendo que veja
        <a href="https://www.kaggle.com/elloaguedes/panorama-do-covid-19-no-brasil">
        este kernel no Kaggle</a>, que mostra muito bem a situação de cada estado.
        Além disso, lá você poderá encontrar exemplos de como aplicar técnicas de
        aprendizagem de máquina para prever o número de casos de COVID-19 no Brasil.`,
        en: `If you are interested in data from Brazil, I recommend you to see
        <a href="https://www.kaggle.com/elloaguedes/panorama-do-covid-19-no-brasil">
        this Kaggle kernel</a> that shows very well the situation in each state. There
        You will be able to find examples on how to apply Machine Learning Techniques
        to predict the number of COVID-19 cases in Brazil.`
    },
    confirmedLabel: {
        pt: 'Casos Confirmados',
        en: 'Confirmed Cases',
    },
    deathsLabel: {
        pt: 'Óbitos',
        en: 'Deaths'
    },
    recoveredLabel: {
        pt: 'Recuperados',
        en: 'Recovered'
    },
    legend: {
        confirmed: {
            pt: 'Total de Casos Confirmados',
            en: 'Total Confirmed Cases',
        },
        deaths: {
            pt: 'Total de Óbitos',
            en: 'Total Deaths',
        },
        recovered: {
            pt: 'Total de Recuperações',
            en: 'Total Recoveries',
        },
        xLabel: {
            pt: 'Data',
            en: 'Date'
        },
        yLabel: {
            pt: 'Indivíduos',
            en: 'Individuals'
        }
    },
    buttonsText: {
        pt: (p1, p2, p3) => `Dia: ${p1} de ${p2}. ${p3}.`,
        en: (p1, p2, p3) => `Day: ${p1} of ${p2}. ${p3}.`
    },
    tooltip: {
        pt: (d) => {
            const singleCase = !d.properties.country ? null : d.properties.confirmed[index] === 1;
            const singleDeath = !d.properties.country ? null : d.properties.deaths[index] === 1;
            const singleRecovery = !d.properties.country ? null : d.properties.recovered[index] === 1;
            const text = !d.properties.country
                ? `País: ${d.properties.COUNTRY}. Nenhum dado foi reportado.`
                : `País: ${d.properties.COUNTRY}. Em ${languageMapping.dateToText(timeScale.invert(index))},
                este país havia reportado ${d.properties.confirmed[index]} caso${singleCase ? '' : 's'}
                confirmado${singleCase ? '' : 's'}, ${d.properties.deaths[index]} óbito${singleDeath ? '' : 's'},
                e ${d.properties.recovered[index]} recuperaç${singleRecovery ? 'ão' : 'ões'}`;
            return text;
        },
        en: (d) => {
            const singleCase = !d.properties.country ? null : d.properties.confirmed[index] === 1;
            const singleDeath = !d.properties.country ? null : d.properties.deaths[index] === 1;
            const singleRecovery = !d.properties.country ? null : d.properties.recovered[index] === 1;
            const text = !d.properties.country
                ? `Country: ${d.properties.COUNTRY}. No data was provided.`
                : `Country: ${d.properties.COUNTRY}. In ${languageMapping.dateToText(timeScale.invert(index))},
                this country had reported ${d.properties.confirmed[index]} confirmed case${singleCase ? '' : 's'},
                ${d.properties.deaths[index]} case${singleDeath ? '' : 's'} of death, and ${d.properties.recovered[index]}
                case${singleRecovery ? '' : 's'} of recovery`;
            return text;
        }
    },
    ptMonths: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    dateToText: (date) => {
        const textDate = language === 'pt'
            ? `${formatDay(date)} de ${languageMapping.ptMonths[formatMonth(date) - 1]}
            de ${formatYear(date)}`
            : exibitDate(date);
        return textDate;
    },
    marker: (value) => {
        let valueAsText = value.toString().split('').reverse();
        valueAsText = valueAsText.map((l, i) => {
            if (i % 3 != 0 || i == 0) return l;
            const sep = language === 'pt' ? '.' : ',';
            return l + sep;
        });
        return valueAsText.reverse().join('');
    }
}

const changeLanguage = () => {
    language = language === 'pt' ? 'en' : 'pt';
    displayLanguage();
}

const displayLanguage = () => {
    document.getElementById('change-lang').innerHTML = languageMapping.change[language];
    document.getElementById('early-text').innerHTML = `<p>${languageMapping.p1[language]}</p>`;

    // Labels
    document.getElementById('confirmed-label').innerHTML = languageMapping.confirmedLabel[language];
    document.getElementById('deaths-label').innerHTML = languageMapping.deathsLabel[language];
    document.getElementById('recovered-label').innerHTML = languageMapping.recoveredLabel[language];


    document.getElementById('later-text').innerHTML = `
        <p>${languageMapping.p2[language]}</p>
        <p>${languageMapping.p3[language]}</p>
        <p>${languageMapping.p4[language]}</p>
        <p>${languageMapping.p5[language]}</p>
    `;

    completeCallback();
}

window.onload = displayLanguage;
