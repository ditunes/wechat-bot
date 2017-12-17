#!/bin/bash

docker run -ti  \
--volume="$(pwd)":/bot --rm zixia/wechaty:latest  src/index.ts 
