#!/usr/bin/env bash
docker run -p 8080:8080 --env-file .env -v ${PWD}/data:/usr/src/data planarnetwork/one-way-api
