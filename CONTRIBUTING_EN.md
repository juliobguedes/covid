# Contributing

Contributing to this project is quite simple and only a few dependencies are required. The requisites are:
* Python 3.6 and pip
* node and npm

The non-native Python packages that we are using are:
* numpy: `pip install numpy`
* pandas: `pip install pandas`

The npm modules that are being used were explained throughly in the notebook [Generating - Map GeoJson](notebooks/Generating\-\Map\GeoJson.ipynb), and reading it you'll understand what each module does and how to install them.

To run the web project, no other dependencies are required:
* With your terminal opened in the project folder, enter the docs folder using `cd docs/` and start an http server in python using `python -m http.server`. After executing this command, the web project will be available in the port 8000.
