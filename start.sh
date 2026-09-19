#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

echo "Starting Postgres..."
docker compose up -d postgres

echo "Waiting for Postgres to accept connections..."
until docker compose exec -T postgres pg_isready -h 127.0.0.1 -U postgres > /dev/null 2>&1; do
  sleep 1
done

cd backend

if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Running migrations..."
npm run migrate

echo "Starting server..."
exec node index.js
