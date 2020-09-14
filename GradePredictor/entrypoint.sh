#!/bin/bash
set -e

if [ "$1" == "runserver" ]; then
  echo "==============================="
  echo "  Running in production mode"
  echo "==============================="
  exec /usr/local/bin/uwsgi \
      --wsgi-file main.py \
      --callable app \
      --master \
      --socket 0.0.0.0:8080 \
      --http 0.0.0.0:8000 \
      --processes=2 \
      --harakiri=20 \
      --max-requests=5000 \
      --enable-threads \
      --vacuum
fi

exec "$@"