# Build React client
FROM node:20-buster AS builder

WORKDIR /app

COPY "./client/." ./
RUN npm install && npm run build

# Build Python server
FROM python:3.11-slim

# Reduce Docker image layers
RUN apt-get update && \
    apt-get install -y nginx libtiff5-dev libjpeg62-turbo-dev libopenjp2-7-dev zlib1g-dev libfreetype6-dev liblcms2-dev libwebp-dev tcl8.6-dev tk8.6-dev python3-tk libharfbuzz-dev libfribidi-dev libxcb1-dev  ffmpeg libsm6 libxext6

# link nginx logs to container stdout
RUN ln -sf /dev/stdout /var/log/nginx/access.log && ln -sf /dev/stderr /var/log/nginx/error.log

# Clean up nginx configuration
RUN rm -rf /etc/nginx/sites-enabled/default /usr/share/nginx/html/* /etc/nginx/sites-available/*

# Setup NGINX with config
COPY ./lib/nginx.conf /etc/nginx/conf.d/default.conf

# Move all build files to NGINX serve folder
COPY --from=builder /app/dist /app/frontend

COPY ./server /app
COPY ./lib/boot.sh /app

WORKDIR /app

# install python dependencies
# RUN pip install poetry && \
#    poetry config virtualenvs.create false && \
#    poetry install

RUN pip install flask gunicorn ffmpeg-python ffmpeg python-dotenv

EXPOSE 80
EXPOSE 5100

# make our entrypoint.sh executable
RUN chmod +x ./boot.sh

CMD ["./boot.sh"]
