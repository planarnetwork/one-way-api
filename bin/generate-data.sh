#!/usr/bin/env sh
wget https://s3.eu-west-2.amazonaws.com/feeds.planar.network/gb-rail-latest.zip -O /tmp/rail.gtfs
wget https://s3.eu-west-2.amazonaws.com/feeds.planar.network/ncsd-bus-latest.zip -O /tmp/ncsd.gtfs
./node_modules/.bin/gtfsmerge /tmp/rail.gtfs /tmp/ncsd.gtfs ./data/output.zip
