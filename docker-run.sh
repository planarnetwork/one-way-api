#!/usr/bin/env bash
docker run -p 8080:8080 --env-file .env -v /home/linus/Downloads:/usr/src/data planarnetwork/one-way-api
