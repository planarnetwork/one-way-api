![one-way-api](logo.png)

[![Travis](https://img.shields.io/travis/planarnetwork/one-way-api.svg?style=flat-square)](https://travis-ci.org/planarnetwork/one-way-api) ![npm](https://img.shields.io/npm/v/one-way-api.svg?style=flat-square) ![David](https://img.shields.io/david/planarnetwork/one-way-api.svg?style=flat-square)

This API makes use of the [Raptor journey planner](https://www.github.com/planarnetwork/raptor) to provide an endpoint for the one-way.to front end.

## Installation

Please note that [node 10.x](https://nodejs.org) or above are required.

```
sudo apt-get install nodejs
npm install one-way-api
```

## Usage

It can be run by specifying the GTFS dataset as an ENV option:

```
GTFS=data/output.zip npm start
```

or using docker:

```
./docker-run.sh
```


## Contributing

Issues and PRs are very welcome. To get the project set up run

```
git clone git@github.com:planarnetwork/one-way-api
npm install --dev
npm test
```

If you would like to send a pull request please write your contribution in TypeScript and if possible, add a test.

## License

This software is licensed under [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html).

Location data sourced from [geonames](http://download.geonames.org/export/dump/).
