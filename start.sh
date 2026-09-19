#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

echo "Starting Postgres..."
docker compose up -d postgres

echo "Waiting for Postgres to accept connections..."
until docker compose exec -T postgres pg_isready -h 127.0.0.1 -U postgres > /dev/null 2>&1; do
  sleep 1
done

if [ ! -d frontend/node_modules ]; then
  echo "Installing frontend dependencies..."
  (cd frontend && npm install)
fi

cd backend

if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Running migrations..."
npm run migrate

echo "Starting frontend..."
setsid npm run dev --prefix ../frontend &
FRONTEND_PID=$!

cleanup() {
  trap - EXIT INT TERM
  kill -- "-$FRONTEND_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo "Starting server..."
node index.js
