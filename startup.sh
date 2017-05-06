#!/bin/bash

docker run -ti --volume="$(pwd)":/bot --rm zixia/wechaty:onbuild src/index.ts