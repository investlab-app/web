#!/bin/sh

# Substitute environment variables in nginx.conf.template
envsubst '${BACKEND_SERVICE_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx
nginx -g "daemon off;"