#!/bin/bash

# Run the bot inside the official Wechaty Docker container, mounting the current directory as /bot
docker run -ti --volume="$(pwd)":/bot --rm zixia/wechaty:onbuild src/index.ts