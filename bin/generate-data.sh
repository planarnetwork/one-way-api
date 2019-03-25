#!/usr/bin/env sh
#wget https://s3.eu-west-2.amazonaws.com/feeds.planar.network/gb-rail-latest.zip -O /tmp/rail.gtfs
#wget https://s3.eu-west-2.amazonaws.com/feeds.planar.network/ncsd-bus-latest.zip -O /tmp/ncsd.gtfs
#wget https://data.sncf.com/explore/dataset/sncf-intercites-gtfs/files/ed829c967a0da1252f02baaf684db32c/download/ -O /tmp/fr-intercity-rail.gtfs
#wget https://gtfs.irail.be/nmbs/gtfs/gtfs-nmbs-2019-03-12.zip -O /tmp/be-intercity-rail.gtfs
#wget https://api.idbus.com/gtfs.zip -O /tmp/fr-intercity-bus.gtfs
#wget https://s3.eu-west-2.amazonaws.com/feeds.planar.network/eurostar.zip -O /tmp/eurostar.gtfs
./node_modules/.bin/gtfsmerge \
  /tmp/rail.gtfs /tmp/ncsd.gtfs \
  /tmp/fr-intercity-rail.gtfs \
  /tmp/eurostar.gtfs \
  ./data/output.zip
