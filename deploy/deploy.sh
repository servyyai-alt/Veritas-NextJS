#!/usr/bin/env bash
set -Eeuo pipefail
cd /opt/veritas
registry=${1:?ECR registry required}
sha=${2:?Commit SHA required}
[[ "$registry" =~ ^[0-9]{12}\.dkr\.ecr\.ap-south-1\.amazonaws\.com$ ]]
[[ "$sha" =~ ^[a-f0-9]{40}$ ]]
test -s .env
# Serialize workflow deployments and manual calls on the host.
exec 9>.deploy.lock
flock -w 300 9
export AWS_REGION=ap-south-1
# Credentials must come from the EC2 instance profile, never static files/env.
unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN AWS_PROFILE AWS_DEFAULT_PROFILE
export AWS_SHARED_CREDENTIALS_FILE=/dev/null AWS_CONFIG_FILE=/dev/null
export APP_IMAGE="$registry/veritas-fullstack:$sha"
aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$registry"
trap 'echo "Deployment failed; inspect docker compose ps and docker compose logs on EC2" >&2' ERR
docker compose --env-file /dev/null pull app
docker inspect --format '{{.Config.Image}}' veritas-app > previous-image.txt.tmp 2>/dev/null || true
if test -s previous-image.txt.tmp; then mv previous-image.txt.tmp previous-image.txt; fi
docker compose --env-file /dev/null up -d --wait --wait-timeout 120 app
# Persist the selected SHA without touching the application secrets.
printf 'APP_IMAGE=%s\n' "$APP_IMAGE" > .image.env.tmp
mv .image.env.tmp .image.env
# Only dangling images; retain tagged SHA images for rollback.
docker image prune -f
curl --fail --silent --show-error --max-time 10 http://127.0.0.1:3000/api/health
printf '\nDeployed %s\n' "$APP_IMAGE"
