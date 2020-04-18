npx shp2json ../data/world_shp/World_Countries.shp -o ../data/countries.json

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

# ================================ #

npx shp2json ../data/brasil_shp/UFEBRASIL.shp -o ../data/brasil_shp.json

npx geoproject \
    'd3.geoOrthographic().rotate([52, 14, 0]).fitSize([1000, 600], d)' \
    < ../data/brasil_shp.json \
    > ../data/plane_brasil.json

npx ndjson-split 'd.features' \
    < ../data/plane_brasil.json \
    > ../data/plane_brasil.ndjson

npx ndjson-split 'd' \
    < ../data/brasil_covid.json \
    > ../data/brasil_covid.ndjson

npx ndjson-map 'd.cod_estado = Number(d.properties.CD_GEOCODU), d' \
    < ../data/plane_brasil.ndjson \
    > ../data/plane_brasil_ortho.ndjson

npx ndjson-join --left 'd.cod_estado' \
    ../data/plane_brasil_ortho.ndjson \
    ../data/brasil_covid.ndjson \
    > ../data/brasil_full.ndjson

npx ndjson-map \
  'd[0].properties = Object.assign({}, d[1]), d[0]' \
  < ../data/brasil_full.ndjson \
  > ../data/brasil_ortho_full.ndjson

npx geo2topo -n \
    tracts=../data/brasil_ortho_full.ndjson \
    > ../data/brasil_topo.json

npx toposimplify -p 1 -f \
    < ../data/brasil_topo.json \
    | npx topoquantize 1e5 \
    > ../data/brasil_quantized_topo.json

npx topo2geo tracts=- \
    < ../data/brasil_quantized_topo.json \
    > ../data/brasil_topo_features.json


# ================================ #


npx shp2json ../data/australia_shp/Australia_Polygon.shp -o ../data/australia_shp.json

npx geoproject \
    'd3.geoOrthographic().rotate([-134, 25, 0]).fitSize([1000, 600], d)' \
    < ../data/australia_shp.json \
    > ../data/plane_australia.json

npx ndjson-split 'd.features' \
    < ../data/plane_australia.json \
    > ../data/plane_australia.ndjson

npx ndjson-split 'd' \
    < ../data/Australia.json \
    > ../data/australia_covid.ndjson

npx ndjson-map 'd.state = d.properties.name, d' \
    < ../data/plane_australia.ndjson \
    > ../data/plane_australia_ortho.ndjson

npx ndjson-join --left 'd.state' \
    ../data/plane_australia_ortho.ndjson \
    ../data/australia_covid.ndjson \
    > ../data/australia_full.ndjson

npx ndjson-map \
    'd[0].properties = Object.assign({}, d[1]), d[0]' \
    < ../data/australia_full.ndjson \
    > ../data/australia_ortho_full.ndjson

npx geo2topo -n \
    tracts=../data/australia_ortho_full.ndjson \
    > ../data/australia_topo.json

npx toposimplify -p 1 -f \
    < ../data/australia_topo.json \
    | npx topoquantize 1e5 \
    > ../data/australia_quantized_topo.json

npx topo2geo tracts=- \
    < ../data/australia_quantized_topo.json \
    > ../data/australia_topo_features.json