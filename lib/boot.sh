#!/bin/bash

RUN_PORT="5100"

export FLASK_ENV=production
export ENV=production
gunicorn wsgi:app --bind "0.0.0.0:${RUN_PORT}" --daemon

nginx -g 'daemon off;'
