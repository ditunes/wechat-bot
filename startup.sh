#!/bin/bash

docker run -ti  \
--volume="$(pwd)":/bot --rm zixia/wechaty src/index.ts nsenter -t 1 -m -u -n -i date -u $(date -u +%m%d%H%M%Y)