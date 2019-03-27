#!/usr/bin/env sh
wget -N https://s3.eu-west-2.amazonaws.com/feeds.planar.network/gb-rail-latest.zip -O /tmp/rail.gtfs
wget -N https://s3.eu-west-2.amazonaws.com/feeds.planar.network/ncsd-bus-latest.zip -O /tmp/ncsd.gtfs
wget -N https://data.sncf.com/explore/dataset/sncf-intercites-gtfs/files/ed829c967a0da1252f02baaf684db32c/download/ -O /tmp/fr-intercity-rail.gtfs
wget -N https://gtfs.irail.be/nmbs/gtfs/gtfs-nmbs-2019-03-12.zip -O /tmp/be-intercity-rail.gtfs
wget -N https://api.idbus.com/gtfs.zip -O /tmp/fr-intercity-bus.gtfs
wget -N https://s3.eu-west-2.amazonaws.com/feeds.planar.network/eurostar.zip -O /tmp/eurostar.gtfs

./node_modules/.bin/gtfsmerge --transfer-distance=0.06 /tmp/fr-intercity-rail.gtfs /tmp/eurostar.gtfs ./data/fr.zip

./node_modules/.bin/gtfsmerge \
  /tmp/rail.gtfs \
  /tmp/ncsd.gtfs \
  ./data/fr.zip \
  ./data/output.zip
