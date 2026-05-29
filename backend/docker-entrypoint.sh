#!/bin/sh
set -e

echo "Synchronisation du schema Prisma..."
npx prisma db push --skip-generate

echo "Verification du seed..."
node prisma/seed.js

echo "Demarrage de l'API NestJS..."
exec node dist/main
