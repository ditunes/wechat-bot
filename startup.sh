#!/bin/bash

docker run -ti --volume="$(pwd)":/bot --rm zixia/wechaty src/index.ts