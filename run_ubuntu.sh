#!/bin/bash
docker run -p 8123:80 --name karaoke --mount type=bind,source=/home/karaoke/Videos,target=/mnt/videos --mount type=bind,source=/mnt/usb/,target=/mnt/usb/videos --rm karaoke
