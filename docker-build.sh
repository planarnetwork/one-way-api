#!/usr/bin/env bash
npm run prepublishOnly
docker build -t planarnetwork/one-way-api .

