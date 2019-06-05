#!/usr/bin/env sh
mkdir -p /tmp/oneway

wget -P -N https://s3.eu-west-2.amazonaws.com/feeds.planar.network/gb-rail-latest.zip -O /tmp/oneway/gb-rail.zip
wget -P -N https://s3.eu-west-2.amazonaws.com/feeds.planar.network/ncsd-bus-latest.zip -O /tmp/oneway/gb-coach.zip
wget -P -N https://data.sncf.com/explore/dataset/sncf-intercites-gtfs/files/ed829c967a0da1252f02baaf684db32c/download/ -O /tmp/fr-intercity-rail.zip
wget -P -N https://data.sncf.com/explore/dataset/sncf-ter-gtfs/files/24e02fa969496e2caa5863a365c66ec2/download/ -O /tmp/fr-ter-rail.zip
wget -P -N https://s3.eu-west-2.amazonaws.com/feeds.planar.network/eurostar.zip -O /tmp/eurostar.zip
wget -P -N https://gtfs.irail.be/nmbs/gtfs/gtfs-nmbs-2019-03-12.zip -O /tmp/oneway/be-intercity-rail.zip
wget -P -N https://transitfeeds.com/p/openov/621/latest/download -O /tmp/oneway/lu-intercity-rail.zip
wget -P -N https://transitfeeds.com/p/renfe/1018/latest/download -O /tmp/oneway/es-intercity-rail.zip
wget -P -N http://data.ndovloket.nl/flixbus/flixbus-eu.zip -O /tmp/oneway/eu-flix-bus.zip
wget -P -N https://api.idbus.com/gtfs.zip -O /tmp/eu-oui-bus.zip
wget -P -N https://github.com/fredlockheed/db-fv-gtfs/releases/download/2019.0.0/2019.zip -O /tmp/oneway/de-intercity-rail.zip
wget -P -N https://gtfs.geops.ch/dl/gtfs_train.zip -O /tmp/oneway/ch-rail.zip
wget -P -N https://transitfeeds.com/p/trafiklab/50/latest/download -O /tmp/oneway/se-all.zip
wget -P -N https://transitfeeds.com/p/ministry-of-transport-and-communications/921/latest/download -O /tmp/fi-all.zip
wget -P -N https://transitfeeds.com/p/rejseplanen/705/latest/download -O /tmp/oneway/dk-all.zip
wget -P -N https://transitfeeds.com/p/maanteeamet/510/latest/download -O /tmp/oneway/ee-all.zip
wget -P -N http://gtfs.ovapi.nl/nl/gtfs-nl.zip -O /tmp/nl-all.zip

# Lots of data but doesn't seem to work
# wget -P -N https://transitfeeds.com/p/entur/970/latest/download -O /tmp/oneway/no-all.zip

# DB, lots of data but only covers a small area?
# wget -P -N https://data.opendatasoft.com/explore/dataset/de@navitia/files/400d7da94eaacb5e52c612f8ac28e420/download/ -O /tmp/de-rail.zip


# No connecting ferries
# wget -P -N https://transitfeeds.com/p/irish-rail/1046/latest/download -O /tmp/ie-intercity-rail.zip

# Not updated
# wget -P -N https://transitfeeds.com/p/renfe/1016/latest/download -O /tmp/es-catelonia-all.zip

./node_modules/.bin/gtfsmerge --remove-route-types=0,1,3 /tmp/nl-all.zip /tmp/oneway/nl-all.zip
./node_modules/.bin/gtfsmerge --transfer-distance=3.5 /tmp/fr-ter-rail.zip /tmp/fr-intercity-rail.zip /tmp/eurostar.zip /tmp/oneway/fr-all.zip
./node_modules/.bin/gtfsmerge --stop-prefix=oui_ /tmp/eu-oui-bus.zip /tmp/oneway/eu-oui-bus-modified.zip
./node_modules/.bin/gtfsmerge --stop-prefix=fi_ /tmp/fi-all.zip /tmp/oneway/fi-all.zip
./node_modules/.bin/gtfsmerge --remove-route-types=1501,0,1,400,401,402,403,404 /tmp/oneway/*.zip ./data/output.zip
