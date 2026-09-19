#!/usr/bin/env bash

set -euo pipefail

cd /var/www/veritas

registry=${1:?ECR registry required}
sha=${2:?Commit SHA required}

[[ "$registry" =~ ^555915161335\.dkr\.ecr\.us-east-1\.amazonaws\.com$ ]]
[[ "$sha" =~ ^[a-f0-9]{40}$ ]]

test -s .env

on_failure() {
  status=$?

  echo "Deployment failed; current Compose state:" >&2
  docker compose --env-file .image.env ps >&2 || true

  echo "Recent veritas-app logs:" >&2
  docker logs --tail 120 veritas-app >&2 || true

  exit "$status"
}

trap on_failure ERR

# Prevent multiple deployments from running at the same time.
exec 9>.deploy.lock
flock -w 300 9

export AWS_REGION=us-east-1

# Credentials must come from the EC2 IAM role.
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY
unset AWS_SESSION_TOKEN
unset AWS_PROFILE
unset AWS_DEFAULT_PROFILE

export AWS_SHARED_CREDENTIALS_FILE=/dev/null
export AWS_CONFIG_FILE=/dev/null

export APP_IMAGE="$registry/veritas-fullstack:$sha"

echo "Logging in to Amazon ECR..."

aws ecr get-login-password --region "$AWS_REGION" \
  | docker login \
      --username AWS \
      --password-stdin "$registry"

# Save the exact Docker image that should be deployed.
# This is only for Docker Compose interpolation.
# Application secrets remain inside /var/www/veritas/.env.
printf 'APP_IMAGE=%s\n' "$APP_IMAGE" > .image.env.tmp
mv .image.env.tmp .image.env

echo "Pulling Docker image..."

docker compose --env-file .image.env pull

echo "Starting Veritas container..."

docker compose --env-file .image.env up -d --remove-orphans

echo "Checking container status..."

docker inspect --format '{{.State.Status}}' veritas-app \
  | grep -qx running

echo "Waiting for application health check..."

for attempt in 1 2 3 4 5 6 7 8 9 10 11 12; do

  if curl \
    --fail \
    --silent \
    --show-error \
    --max-time 10 \
    http://127.0.0.1:3000/api/health \
    >/dev/null; then

    printf 'Health check passed on attempt %s\n' "$attempt"
    break
  fi

  if [ "$attempt" -eq 12 ]; then
    echo "Health check failed after 12 attempts" >&2
    exit 1
  fi

  echo "Application not ready yet. Retry $attempt/12..."
  sleep 5

done

echo "Cleaning unused dangling Docker images..."

docker image prune -f

printf '\nDeployment successful\n'
printf 'Deployed image: %s\n' "$APP_IMAGE"