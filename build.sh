#!/usr/bin/env bash
set -e

echo "==> Installing Python dependencies..."
pip install -r requirements.txt

echo "==> Installing Node dependencies..."
npm install

echo "==> Building React frontend..."
npm run build

echo "==> Collecting Django static files..."
python manage.py collectstatic --no-input

echo "==> Running database migrations..."
python manage.py migrate

echo "==> Build complete."
