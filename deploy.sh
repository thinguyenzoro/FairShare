#!/bin/bash
set -e

echo "=========================================="
echo "   DEPLOYING SPLITBILL APP WITH DOCKER    "
echo "=========================================="

# Ensure data directory exists
mkdir -p data

# Pull and rebuild containers
docker compose down || true
docker compose up --build -d

echo "=========================================="
echo " SUCCESS: App is running on port 8000!"
echo " Access at: http://<YOUR_VPS_IP>:8000"
echo "=========================================="
