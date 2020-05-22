npx shp2json ../data/World_Countries.shp -o ../data/countries.json

npx geoproject \
    'd3.geoMercator().fitSize([1000, 600], d).center([0, 20]).scale(150)' \
    < ../data/countries.json \
    > ../data/plane_countries.json

npx ndjson-split 'd.features' \
    < ../data/plane_countries.json \
    > ../data/plane_countries.ndjson

npx ndjson-split 'd' \
    < ../data/covid_updated.json \
    > ../data/covid_data.ndjson

npx ndjson-map 'd.country = d.properties.COUNTRY, d' \
    < ../data/plane_countries.ndjson \
    > ../data/plane_countries_ortho.ndjson

npx ndjson-join --left 'd.country' \
    ../data/plane_countries_ortho.ndjson \
    ../data/covid_data.ndjson \
    > ../data/covid_full.ndjson

npx ndjson-map \
    'd[0].properties = Object.assign({}, d[0].properties, d[1]), d[0]' \
    < ../data/covid_full.ndjson \
    > ../data/covid_ortho_full.ndjson

npx geo2topo -n \
    tracts=../data/covid_ortho_full.ndjson \
    > ../data/covid_topo.json

npx toposimplify -p 1 -f \
    < ../data/covid_topo.json \
    | ../node_modules/.bin/topoquantize 1e5 \
    > ../data/covid_quantized_topo.json

npx topo2geo tracts=- \
    < ../data/covid_quantized_topo.json \
    > ../data/covid_topo_features.json

cp ../data/covid_topo_features.json ../docs/data/covid_topo_features.json

rm ../data/countries.json ../data/plane_countries.json
rm ../data/covid_data.ndjson ../data/plane_countries_ortho.ndjson ../data/covid_full.ndjson
rm ../data/covid_ortho_full.ndjson ../data/covid_topo.json ../data/covid_quantized_topo.json

cp ../data/covid_chart.json ../docs/data/covid_chart.json

echo "Pushing to git"
bash push_to_git.sh