#!/usr/bin/env bash
# exit on error
set -o errexit

yarn -g @nestjs/cli
yarn
yarn build
yarn typeorm migration:run -- -d dist/data-source
