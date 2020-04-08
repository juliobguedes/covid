# Contributing

Para contribuir para o projeto é bastante simples e poucas dependências são necessárias. Os requisitos são:
* Python 3.6 e pip
* node e npm

Os pacotes não nativos de Python que estamos usando são:
* numpy: `pip install numpy`
* pandas: `pip install pandas`

Os módulos npm que estamos usando estão citados no notebook [Generating - Map GeoJson](notebooks/Generating\-\Map\GeoJson.ipynb), enquanto se faz o walkthrough de "para que serve cada módulo".

Para rodar o projeto web, não são necessárias dependências:
* Estando na pasta do projeto, entre na pasta docs pelo comando `cd docs/` e levante um servidor http simples com Python: `python -m http.server`. Após executar este comando o projeto web estará disponível na porta 8000.

