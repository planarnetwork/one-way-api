#!/usr/bin/env sh
wget -P -N https://s3.eu-west-2.amazonaws.com/feeds.planar.network/gb-rail-latest.zip -O /tmp/gb-rail.zip
wget -P -N https://s3.eu-west-2.amazonaws.com/feeds.planar.network/ncsd-bus-latest.zip -O /tmp/gb-coach.zip
wget -P -N https://data.sncf.com/explore/dataset/sncf-intercites-gtfs/files/ed829c967a0da1252f02baaf684db32c/download/ -O /tmp/fr-intercity-rail.zip
wget -P -N https://data.sncf.com/explore/dataset/sncf-ter-gtfs/files/24e02fa969496e2caa5863a365c66ec2/download/ -O /tmp/fr-ter-rail.zip
wget -P -N https://s3.eu-west-2.amazonaws.com/feeds.planar.network/eurostar.zip -O /tmp/eurostar.zip
wget -P -N https://gtfs.irail.be/nmbs/gtfs/gtfs-nmbs-2019-03-12.zip -O /tmp/be-intercity-rail.zip
wget -P -N https://transitfeeds.com/p/openov/621/latest/download -O /tmp/lu-intercity-rail.zip
wget -P -N https://transitfeeds.com/p/renfe/1018/latest/download -O /tmp/es-intercity-rail.zip
wget -P -N https://transitfeeds.com/p/renfe/1016/latest/download -O /tmp/es-catelonia-all.zip
wget -P -N http://data.ndovloket.nl/flixbus/flixbus-eu.zip -O /tmp/eu-flix-bus.zip
wget -P -N https://api.idbus.com/gtfs.zip -O /tmp/eu-oui-bus.zip
wget -P -N https://github.com/fredlockheed/db-fv-gtfs/releases/download/2019.0.0/2019.zip -O /tmp/de-intercity-rail.zip
wget -P -N https://gtfs.geops.ch/dl/gtfs_train.zip -O /tmp/ch-rail.zip

# DB, lots of data but only covers a small area?
# wget -P -N https://data.opendatasoft.com/explore/dataset/de@navitia/files/400d7da94eaacb5e52c612f8ac28e420/download/ -O /tmp/de-rail.zip

# NL, Too much data?
# wget -P -N http://gtfs.ovapi.nl/nl/gtfs-nl.zip -O /tmp/nl-all.zip

# No connecting ferries
# wget -P -N https://transitfeeds.com/p/irish-rail/1046/latest/download -O /tmp/ie-intercity-rail.zip

./node_modules/.bin/gtfsmerge --transfer-distance=0.06 /tmp/fr-ter-rail.zip /tmp/fr-intercity-rail.zip /tmp/eurostar.zip /tmp/fr-all.zip
./node_modules/.bin/gtfsmerge --stop-prefix=oui_ /tmp/eu-oui-bus.zip /tmp/eu-oui-bus-modified.zip
./node_modules/.bin/gtfsmerge \
  /tmp/gb-rail.zip \
  /tmp/gb-coach.zip \
  /tmp/be-intercity-rail.zip \
  /tmp/lu-intercity-rail.zip \
  /tmp/eu-flix-bus.zip \
  /tmp/eu-oui-bus-modified.zip \
  /tmp/es-intercity-rail.zip \
  /tmp/es-catelonia-all.zip \
  /tmp/de-intercity-rail.zip \
  /tmp/ch-rail.zip \
  /tmp/fr-all.zip \
  ./data/output.zip
