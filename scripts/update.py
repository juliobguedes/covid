"""
Merges the data transformation from the `Generating - Johns Hopkins` notebook and
the GeoJson creation from the `Generating Map` notebook. To run this you will need
to have installed all the npm packages required.
"""

import numpy as np
import pandas as pd
import subprocess, sys, os, json

# ======================================================================== #

print('Running data transformation: World Map')

datapath = '../data'
ts_n_deaths = pd.read_csv(f'{datapath}/time_series_covid19_deaths_global_narrow.csv')
ts_n_deaths = ts_n_deaths.loc[1:].reset_index(drop=True)

ts_n_recov = pd.read_csv(f'{datapath}/time_series_covid19_recovered_global_narrow.csv')
ts_n_recov = ts_n_recov.loc[1:].reset_index(drop=True)

ts_n_conf = pd.read_csv(f'{datapath}/time_series_covid19_confirmed_global_narrow.csv')
ts_n_conf = ts_n_conf.loc[1:].reset_index(drop=True)

ts_n_deaths = ts_n_deaths.astype({ 'Value': 'int64' })
ts_n_recov = ts_n_recov.astype({ 'Value': 'int64' })
ts_n_conf = ts_n_conf.astype({ 'Value': 'int64' })

grouped_deaths = ts_n_deaths.groupby(['Country/Region', 'Date']).agg({ 'Value': 'sum' })
grouped_recov = ts_n_recov.groupby(['Country/Region', 'Date']).agg({ 'Value': 'sum' })
grouped_conf = ts_n_conf.groupby(['Country/Region', 'Date']).agg({ 'Value': 'sum' })

grouped_deaths.columns = ['Deaths']
grouped_recov.columns = ['Recovered']
grouped_conf.columns = ['Confirmed']

grouped = grouped_deaths.merge(grouped_recov, left_index=True, right_index=True)
grouped = grouped.merge(grouped_conf, left_index=True, right_index=True)
grouped.reset_index(drop=False, inplace=True)

def new_cols(row):
    if (row.name > 0 and row['Country/Region'] == grouped.loc[row.name - 1]['Country/Region']):
        row['newConfirmed'] = 0
        row['newDeaths'] = 0
        row['newRecovered'] = 0
    else:
        row['newConfirmed'] = 0
        row['newDeaths'] = 0
        row['newRecovered'] = 0
        
    return row
    
grouped = grouped.apply(new_cols, axis=1)

countries = grouped['Country/Region'].unique()

mapping = {
    'Congo (Brazzaville)': 'Congo',
    'Congo (Kinshasa)': 'Democratic Republic of the Congo',
    'Cote d\'Ivoire': 'Ivory Coast',
    'Czechia': 'Czech Republic',
    'French Guiana': 'French Guiana (France)',
    'Greenland': 'Greenland (Denmark)',
    'Guadeloupe': 'Guadeloupe (France)',
    'Guam': 'Guam (US)',
    'Guernsey': 'Guernsey (UK)',
    'Jersey': 'Jersey (UK)',
    'Korea, South': 'South Korea',
    'Martinique': 'Martinique (France)',
    'Mayotte': 'Mayotte (France)',
    'North Macedonia': 'Macedonia',
    'Puerto Rico': 'Puerto Rico (US)',
    'Reunion': 'Reunion (France)',
    'Saint Lucia': 'St. Lucia',
    'Saint Vincent and the Grenadines': 'St. Vincent and the Grenadines',
    'Taiwan*': 'Taiwan',
    'The Bahamas': 'Bahamas',
    'The Gambia': 'Gambia',
    'US': 'United States'
}

covid_jsons = []

for country in countries:
    ts_segment = grouped[grouped['Country/Region'] == country].copy().reset_index()
    
    covid_json = {
        'country': mapping[country] if country in mapping else country,
        'latitude': ts_n_deaths.loc[1]['Lat'],
        'longitude': ts_n_deaths.loc[1]['Long'],
        'dates': ts_segment['Date'].tolist(),
        'confirmed': ts_segment['Confirmed'].tolist(),
        'deaths': ts_segment['Deaths'].tolist(),
        'recovered': ts_segment['Recovered'].tolist(),
        'newConfirmed': ts_segment['newConfirmed'].tolist(),
        'newDeaths': ts_segment['newDeaths'].tolist(),
        'newRecovered': ts_segment['newRecovered'].tolist()
    }
    covid_jsons.append(covid_json)

with open(f'{datapath}/covid_updated.json', 'w') as json_path:
    json.dump(covid_jsons, json_path)
    
    
# ======================================================================== #
    
print('Running data transformation: Countries Charts')

chart_json = {}
daily_data = {}

for country in countries:
    segment = grouped[grouped['Country/Region'] == country].reset_index()

    daily = []
    for index, row in segment.iterrows():
        daily.append({
            'date': row['Date'],
            'confirmed': row['Confirmed'],
            'deaths': row['Deaths'],
            'recovered': row['Recovered'],
            'newConfirmed': row['newConfirmed'],
            'newDeaths': row['newDeaths'],
            'newRecovered': row['newRecovered']
        })
        
        if row['Date'] in daily_data:
            daily_data[row['Date']]['confirmed'] += row['Confirmed']
            daily_data[row['Date']]['deaths'] += row['Deaths']
            daily_data[row['Date']]['recovered'] += row['Recovered']
            daily_data[row['Date']]['newConfirmed'] += row['newConfirmed']
            daily_data[row['Date']]['newDeaths'] += row['newDeaths']
            daily_data[row['Date']]['newRecovered'] += row['newRecovered']
            
        else:
            daily_data[row['Date']] = {
                'confirmed': row['Confirmed'],
                'deaths': row['Deaths'],
                'recovered': row['Recovered'],
                'newConfirmed': row['newConfirmed'],
                'newDeaths': row['newDeaths'],
                'newRecovered': row['newRecovered']
            }
    
    country_name = mapping[country] if country in mapping else country
    chart_json[country_name] = {
        'country': country_name,
        'data': daily
    }


world_data = []
for key in daily_data.keys():
    daily_data[key]['date'] = key
    world_data.append(daily_data[key])
    
world_obj = {
    'country': 'World',
    'data': world_data
}

chart_json['World'] = world_obj

# ======================================================================== #

print('Running data transformation: Brasil Map')

brasil_df = pd.read_csv(f'{datapath}/brasil.csv', sep=';', encoding='utf-8')
brasil_df.columns = ['região'] + brasil_df.columns.tolist()[1:]

estados = pd.read_csv(f'{datapath}/estados.csv')
estados.loc[0]['COD'], estados.loc[0]['NOME'], estados.loc[0]['SIGLA']

def remove_padding(row):
    row['SIGLA'] = row['SIGLA'][1:]
    return row

estados = estados.apply(remove_padding, axis=1)
estados = estados.set_index('SIGLA')

def completa_info(row, estados_df):
    estado = estados_df.loc[row['sigla']]
    row['estado'] = estado['NOME']
    row['cod_estado'] = estado['COD']
    row['date'] = '-'.join(row['date'].split('/')[::-1])
    return row

brasil_df = brasil_df.apply(completa_info, estados_df=estados, axis=1)

states = brasil_df['estado'].unique()
days_before = [0] * 8
dates_before = ['2020-01-{}'.format(n) for n in range(22, 30)]


# ======================================================================== #

print('Running data transformation: Brasil Charts')

for state in states:
    segment = brasil_df[brasil_df['estado'] == state].copy().reset_index()

    daily = []
    for index, row in segment.iterrows():
        daily.append({
            'date': row['date'],
            'confirmed': row['cases'],
            'deaths': row['deaths'],
            'recovered': 0
        })
    
    chart_json[state] = {
        'country': state,
        'data': daily
    }

# ======================================================================== #

with open(f'{datapath}/covid_chart.json', 'w') as covid_chart:
    json.dump(chart_json, covid_chart)

print('Running map generation')
subprocess.call('./update.sh', shell=True)
