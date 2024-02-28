#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build
npm run typeorm:production migration:run -- -d dist/data-source
