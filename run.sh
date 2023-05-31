#!/bin/bash
docker run -p 8123:80 --name karaoke --mount type=bind,source="$(pwd)"/videos,target=/mnt/videos --rm karaoke
