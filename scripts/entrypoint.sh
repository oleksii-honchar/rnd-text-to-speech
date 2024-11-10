#!/bin/sh
# used in docker to print image version

echo "${IMAGE_NAME}:${IMAGE_VERSION}"

exec "$@"