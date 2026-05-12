#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# Evolve Wellbeing Hub — Azure Container Apps deploy script
# Usage:  ./deploy.sh
# ---------------------------------------------------------------------------

ACR_NAME="evolveacrngm"
IMAGE_NAME="evolve-wellbeing"
RESOURCE_GROUP="evolve-rg"
CONTAINER_APP="evolve-app"
IMAGE_TAG="${ACR_NAME}.azurecr.io/${IMAGE_NAME}:latest"

echo "==> Building Docker image..."
docker build -t "$IMAGE_NAME" .

echo "==> Tagging image for ACR..."
docker tag "$IMAGE_NAME" "$IMAGE_TAG"

echo "==> Logging in to ACR..."
az acr login --name "$ACR_NAME"

echo "==> Pushing image to ACR..."
docker push "$IMAGE_TAG"

echo "==> Deploying new revision to Container Apps..."
FQDN=$(az containerapp update \
  --name "$CONTAINER_APP" \
  --resource-group "$RESOURCE_GROUP" \
  --image "$IMAGE_TAG" \
  --query properties.configuration.ingress.fqdn \
  -o tsv)

echo ""
echo "✅ Deployed successfully!"
echo "🌐 https://${FQDN}"
