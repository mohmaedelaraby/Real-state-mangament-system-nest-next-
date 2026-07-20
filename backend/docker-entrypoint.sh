#!/bin/sh
set -e

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Seeding database..."
npx ts-node prisma/seed.ts

echo "Starting backend..."
exec node dist/src/main.js
