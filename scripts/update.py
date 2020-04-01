"""
Merges the data transformation from the `Generating - Johns Hopkins` notebook and
the GeoJson creation from the `Generating Map` notebook. To run this you will need
to have installed all the npm packages required.
"""

import numpy as np
import pandas as pd
import subprocess, sys, os, json

print('Running data transformation')

datapath = '../data'
ts_n_deaths = pd.read_csv(f'{datapath}/time_series_covid19_deaths_global_narrow.csv')
ts_n_recov = pd.read_csv(f'{datapath}/time_series_covid19_recovered_global_narrow.csv')
ts_n_conf = pd.read_csv(f'{datapath}/time_series_covid19_confirmed_global_narrow.csv')

new_columns = list(ts_n_conf.columns)[:-1] + ['Confirmed']
ts_n_conf.columns = new_columns

ts_all = ts_n_conf.copy()
ts_all['Recovered'] = ts_n_recov['Value']
ts_all['Deaths'] = ts_n_deaths['Value']
ts = ts_all.loc[1:]
ts = ts.fillna(0)
ts = ts.astype({ 'Confirmed': 'int', 'Recovered': 'int', 'Deaths': 'int' })

ts_grouped = ts.groupby(['Country/Region', 'Date']).agg({ 'Confirmed': 'sum', 'Recovered': 'sum', 'Deaths': 'sum' })

countries = ts['Country/Region'].unique()

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
    ts_segment = ts[ts['Country/Region'] == country].copy().reset_index()
    ts_grouped_segment = ts_grouped.loc[country].reset_index()
    
    covid_json = {
        'country': mapping[country] if country in mapping else country,
        'latitude': ts_segment.loc[0]['Lat'],
        'longitude': ts_segment.loc[0]['Long'],
        'dates': ts_grouped_segment['Date'].tolist(),
        'confirmed': ts_grouped_segment['Confirmed'].tolist(),
        'deaths': ts_grouped_segment['Deaths'].tolist(),
        'recovered': ts_grouped_segment['Recovered'].tolist()
    }
    covid_jsons.append(covid_json)

with open(f'{datapath}/covid_updated.json', 'w') as json_path:
    json.dump(covid_jsons, json_path)

print('Running map generation')
subprocess.call('./update.sh', shell=True)