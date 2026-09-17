# AWS deployment

## Architecture and scope

`push main → GitHub Actions OIDC → Docker build → ECR → SSH → EC2 instance role → Compose → Nginx → HTTPS`

One Next.js 16.2.10 App Router container serves UI and API. No AWS resources are created by this repository. The workflow builds Linux AMD64 images: use **x86_64 Ubuntu 24.04 LTS EC2**, not Graviton. Start with 2 vCPU/4 GiB RAM and sufficient EBS disk; monitor actual usage. Docker builds run in GitHub, not EC2. This single-container deployment has a brief interruption during replacement; it is not zero-downtime.

`npm run build` remains `next build`; `npm start` remains `next start` for conventional installations. Docker runs the generated standalone `node server.js`. Existing standalone, image remote patterns, and Mongoose external-package configuration are preserved.

## Environment audit

No application variables or secrets are required during Docker build. `.env*` never enters the build context. Runtime values live only in `/opt/veritas/.env`, mode 600. Use `.env.example` as a template. Container startup rejects a missing MongoDB URI, a JWT secret shorter than 32 characters, and known template placeholders.

| Variable | Classification | Required / purpose |
| --- | --- | --- |
| `MONGODB_URI` | Server-only runtime secret | Required; MongoDB URI including database name and encoded credentials |
| `JWT_SECRET` | Server-only runtime secret | Required; generate with `openssl rand -hex 32` |
| `ADMIN_PASSWORD` | Server-only runtime secret | First administrator bootstrap or explicit seed only; remove after first successful login |
| `CLOUDINARY_API_KEY` | Server-only runtime secret | Required for image uploads; treated conservatively as confidential |
| `CLOUDINARY_API_SECRET` | Server-only runtime secret | Required for image uploads |
| `JWT_EXPIRES_IN` | Server-only runtime non-secret | Optional, defaults to `7d` |
| `ADMIN_EMAIL` | Server-only runtime non-secret | First administrator bootstrap or seed |
| `CLOUDINARY_CLOUD_NAME` | Server-only runtime non-secret | Required for image uploads |
| `NODE_ENV` | Build/runtime non-secret | Next sets production at build; runner and Compose enforce production |
| `HOSTNAME`, `PORT` | Server-only runtime non-secret | Container listener defaults enforced as `0.0.0.0:3000`; host publishes loopback only |
| `NEXT_TELEMETRY_DISABLED` | Build/runtime non-secret | Docker sets `1`; not an application secret |
| `NEXT_PUBLIC_APP_URL` | Browser/build-time category, **unused** | Found in local env files; no code references it; omit from production |
| `APP_IMAGE` | Deployment-only non-secret | Compose image override, saved in `.image.env`; not a browser/app setting |
| `AWS_REGION`, `ECR_REPOSITORY` | CI/deployment-only non-secret | Fixed to `ap-south-1`, `veritas-fullstack` |

No active `NEXT_PUBLIC_*` variables exist. Future browser variables would be public and baked into the build; never put database, JWT, authentication, SMTP, or private API credentials there. Existing local `.env` files were not copied, printed, or modified. No env files are tracked in the current Git index; this is not an audit of all historical commits.

Compose requires **2.30.0+** for `env_file.format: raw`. Write raw `KEY=value` lines without surrounding quotes, including passwords with `$`. Commands below use a separate interpolation file so application secrets are not interpreted by Compose. Remove unused optional template values rather than leaving placeholders.

## AWS resources to provision manually

- Private ECR repository `veritas-fullstack` in `ap-south-1`, image scanning enabled. Permit `latest` to be overwritten; retain commit tags for rollback. Do not expire the active or intended rollback images.
- EC2 x86_64 Ubuntu instance, EBS volume, instance profile, Elastic IP, and security group. Allow public 80/443, SSH 22 only from approved deployment/admin sources, and **no inbound 3000 or 27017**. GitHub-hosted runner addresses vary: arrange approved runner egress or a runner with fixed egress and update `runs-on` if needed. The runner must reach SSH; do not solve this by opening SSH to everyone.
- IAM GitHub OIDC provider and push role; separate EC2 instance role for pull-only ECR access.
- Domain DNS (Route 53 or existing provider), MongoDB Atlas/external MongoDB with backups and network access from EC2, and Cloudinary account for image uploads.

Optional manual ECR creation from an authenticated administrator workstation (SSO is suitable):

```bash
aws ecr create-repository --region ap-south-1 \
  --repository-name veritas-fullstack \
  --image-tag-mutability MUTABLE \
  --image-scanning-configuration scanOnPush=true
```

### GitHub OIDC role

Provider URL: `https://token.actions.githubusercontent.com`; audience: `sts.amazonaws.com`. Role trust example; replace account/owner/repository placeholders:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"},
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {"StringEquals": {
      "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
      "token.actions.githubusercontent.com:sub": "repo:OWNER/REPOSITORY:ref:refs/heads/main"
    }}
  }]
}
```

For repositories using immutable subject claims (including newer repositories), use the exact `repo:OWNER@OWNER_ID/REPOSITORY@REPO_ID:ref:refs/heads/main` subject instead. Do not use a wildcard across repositories/branches. See [GitHub's OIDC instructions](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws).

Attach this scoped push policy to the GitHub role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {"Effect":"Allow","Action":"ecr:GetAuthorizationToken","Resource":"*"},
    {"Effect":"Allow","Action":[
      "ecr:BatchCheckLayerAvailability","ecr:InitiateLayerUpload",
      "ecr:UploadLayerPart","ecr:CompleteLayerUpload","ecr:PutImage",
      "ecr:BatchGetImage","ecr:GetDownloadUrlForLayer"
    ],"Resource":"arn:aws:ecr:ap-south-1:ACCOUNT_ID:repository/veritas-fullstack"}
  ]
}
```

This follows the [ECR push permissions](https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-push-iam.html). The workflow needs no AWS resource-creation permissions.

### EC2 instance role

Create a role trusted by `ec2.amazonaws.com` for `sts:AssumeRole`, attach it through an instance profile, and require IMDSv2. Grant `ecr:GetAuthorizationToken` on `*` and `ecr:BatchCheckLayerAvailability`, `ecr:BatchGetImage`, `ecr:GetDownloadUrlForLayer` on this repository ARN. No ECR push or IAM administration is needed. AWS CLI on the host obtains temporary credentials from the [EC2 instance role](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html); do not run `aws configure` with access keys. The application itself does not require AWS credentials.

## GitHub configuration

Repository Actions secrets:

- `AWS_ROLE_ARN`: GitHub OIDC push-role ARN.
- `EC2_HOST`: Elastic IP or public hostname, without a URL scheme.
- `EC2_USER`: deployment SSH user, for example `ubuntu`.
- `EC2_SSH_PRIVATE_KEY`: private key whose public key is authorized on EC2.

Also set the **repository variable** `EC2_SSH_KNOWN_HOSTS` to the verified SSH host-key line, e.g. `EC2_HOST ssh-ed25519 AAAA...`. Retrieve `/etc/ssh/ssh_host_ed25519_key.pub` through a trusted EC2 console/SSM session and prefix its contents with the exact `EC2_HOST`. Do not trust an unverified `ssh-keyscan` result. This additional non-secret variable prevents deployment to an impersonated host. No AWS access-key secrets are used.

## Test Docker locally

Install/start Docker first. From the repository, create a separate ignored runtime file without overwriting existing local files:

```bash
cp .env.example .env.docker-test
chmod 600 .env.docker-test
# Edit actual runtime values; remove optional unused placeholders.
nano .env.docker-test
# Generate a JWT secret and paste into the file:
openssl rand -hex 32
docker build -t veritas-fullstack:local .
docker run -d --name veritas-local --env-file .env.docker-test \
  -p 127.0.0.1:3000:3000 veritas-fullstack:local
docker logs veritas-local
curl --fail http://127.0.0.1:3000/api/health
docker inspect --format '{{.State.Health.Status}}' veritas-local
docker exec veritas-local id
docker exec veritas-local sh -c 'find /app -name ".env*" -print'
docker stop veritas-local
docker rm veritas-local
```

Wait for health to become `healthy`. The env-file search should print nothing. Use a reachable test MongoDB, not production data; `localhost` inside the container is the container itself. Docker Desktop can reach a host database through `host.docker.internal`. Authentication cookies are secure in production, so test full login through an HTTPS proxy/domain as well as the loopback health check.

## First EC2 setup

These commands target Ubuntu 24.04 x86_64. Run as the deployment user with sudo access. Install Docker using its [official Ubuntu repository](https://docs.docker.com/engine/install/ubuntu/):

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl unzip nginx snapd
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
sudo tee /etc/apt/sources.list.d/docker.sources >/dev/null <<'DOCKER_APT'
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: noble
Components: stable
Architectures: amd64
Signed-By: /etc/apt/keyrings/docker.asc
DOCKER_APT
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker nginx
sudo usermod -aG docker "$USER"
sudo install -d -m 700 -o "$USER" -g "$USER" /opt/veritas
curl -fsSLo /tmp/awscliv2.zip https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip
unzip -q /tmp/awscliv2.zip -d /tmp/veritas-awscli
sudo /tmp/veritas-awscli/aws/install
```

Log out and back in for Docker group membership (this group grants host-level control). Confirm:

```bash
docker version
docker compose version
aws --version
aws sts get-caller-identity
```

Ensure the returned identity is the EC2 instance role. Authorize the deployment SSH public key and verify SSH connectivity from the chosen runner network.

From the **local workstation**, replace the example host and user:

```bash
scp docker-compose.yml deploy/deploy.sh .env.example ubuntu@EC2_HOST:/opt/veritas/
scp deploy/nginx/veritas.conf ubuntu@EC2_HOST:/opt/veritas/veritas.conf
```

On **EC2**, create the runtime file once:

```bash
cd /opt/veritas
cp .env.example .env
chmod 600 .env
nano .env
openssl rand -hex 32
# Paste the generated secret into .env; configure MongoDB and Cloudinary.
```

Create ECR/IAM/GitHub settings before pushing `main`. The first push builds/pushes both image tags and runs deployment automatically. For an initial manual deployment **after the image exists in ECR**, substitute the account ID and full 40-character built commit SHA:

```bash
cd /opt/veritas
bash deploy.sh ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com FULL_40_CHARACTER_COMMIT_SHA
docker compose --env-file .image.env ps
curl --fail http://127.0.0.1:3000/api/health
```

Configure MongoDB Atlas network access for the EC2 egress IP, not the GitHub runner, and use a database-scoped account. The build never connects to MongoDB. First login with `ADMIN_EMAIL`/`ADMIN_PASSWORD` bootstraps the hashed admin record; then remove `ADMIN_PASSWORD` and recreate the container. Seed scripts remain optional local maintenance tools and are not run by deployment; `seed-full.js` overwrites programme content and must not be used as an automatic migration.

## Nginx, DNS, and HTTPS

Point A records for the apex and `www` names to the Elastic IP (or `www` CNAME to apex). Only publish AAAA records if IPv6 routing is configured. Replace both domain placeholders before installation:

```bash
cd /opt/veritas
nano veritas.conf
sudo cp veritas.conf /etc/nginx/sites-available/veritas
sudo ln -sfn /etc/nginx/sites-available/veritas /etc/nginx/sites-enabled/veritas
sudo nginx -t
sudo systemctl reload nginx
curl --fail http://yourdomain.com/api/health
sudo snap install --classic certbot
sudo ln -sfn /snap/bin/certbot /usr/bin/certbot
sudo certbot --nginx --redirect -d yourdomain.com -d www.yourdomain.com
sudo certbot renew --dry-run
curl --fail https://yourdomain.com/api/health
```

Certbot requires working DNS and public port 80 validation; follow its [Nginx instructions](https://certbot.eff.org/instructions?os=snap&ws=nginx). Keep 80 available for redirects/renewals and 443 for the application. Certbot modifies the installed config; later deployments deliberately do not overwrite it. Nginx forwards the public host and HTTPS scheme, permits 10 MiB request bodies (uploads are limited to 4 MiB in the app), supports upgrade headers, and disables proxy buffering for streamed responses.

## Deployment, operations, and rollback

Only pushes to `main` trigger the workflow. Failures in build, either push, SSH, pull, startup, or health checking fail the job. Each deploy runs the exact commit tag, while `latest` remains available for convenience. Compose [waits for container health](https://docs.docker.com/reference/cli/docker/compose/up/) before pruning dangling images and performing the explicit host curl. Deployments are serialized in GitHub and locked on EC2. `.image.env` stores the selected image and `previous-image.txt` records the previous container image. No automatic rollback or database migration runs.

Routine commands on EC2:

```bash
cd /opt/veritas
docker compose --env-file .image.env ps
docker compose --env-file .image.env logs --tail=100 app
docker compose --env-file .image.env up -d --wait --wait-timeout 120
# After editing runtime variables:
docker compose --env-file .image.env up -d --force-recreate --wait --wait-timeout 120
sudo nginx -t
sudo journalctl -u nginx --since '30 minutes ago'
sudo tail -n 100 /var/log/nginx/error.log
docker inspect --format '{{json .State.Health}}' veritas-app
curl --fail http://127.0.0.1:3000/api/health
df -h
docker system df
```

Rollback: pause pushes until recovery is complete, find a known-good full SHA in ECR/GitHub or `previous-image.txt`, and redeploy it:

```bash
cd /opt/veritas
cat previous-image.txt
bash deploy.sh ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com KNOWN_GOOD_40_CHARACTER_SHA
curl --fail https://yourdomain.com/api/health
```

If Compose or deployment scripts changed incompatibly, restore those files from the same known-good revision before rollback. Image rollback does not undo database changes. Do not prune all tagged images; keep an ECR retention window for rollback. Automatic restart recovers exited containers, but Docker does not restart a merely unhealthy process; add monitoring/alerting for health, disk, memory, TLS expiry, and database backups.

## Production readiness findings

- **Hardcoded credentials fixed:** removed `fallback_secret`, seed default passwords, and password logging. JWT signing/verifying now requires a runtime secret and restricts the algorithm to HS256. Rotate old JWT secrets and any admin account created with the former default password before launch; changing JWT secrets invalidates old sessions.
- **Auth:** migrated deprecated `middleware.js` to Next.js 16 `proxy.js`, using the same JWT verifier as API authorization. Unauthenticated admin redirects use the public host and scheme overwritten by Nginx, because Next.js Proxy requires absolute redirect URLs. Existing HTTP-only, SameSite=Lax, production-secure login cookies remain unchanged. No NextAuth/OAuth callback registration exists. Cookie lifetime remains seven days even if a different JWT lifetime is configured, preserving existing behavior.
- **Database:** connection promise/connection cached per Node process; rejected connection attempts now clear the promise for retry. Required URI is checked on use, not import, so builds need no database secrets. Container startup separately validates mandatory configuration. Liveness does not prove MongoDB/Cloudinary availability; test login, content reads/writes, uploads, and downloads after deployment. Existing content loaders can return defaults on database failure.
- **Browser variables/URLs:** no active public environment variables or localhost API dependencies. Browser fetches already use `/api/...`. `NEXT_PUBLIC_APP_URL` in old env files is unused. Existing SEO/structured-data URLs remain `https://www.veritasbyiqgrads.com`; if deploying to a different final domain, update those metadata URLs before public launch. Localhost examples in this guide refer intentionally to host-only health checks.
- **Integrations:** images upload directly through server-side Cloudinary credentials; PDFs are stored as MongoDB buffers. CRM/counselling/chatbot embed URLs are stored in MongoDB and intentionally sent to browsers; configure HTTPS embed URLs and never put private credentials in those URLs. WhatsApp links and external Google Fonts remain unchanged. No SMTP/payment integration was found.
- **Persistence:** no uploaded file is stored only on the container filesystem. Cloudinary/MongoDB persist across replacements; configure their backup/retention policies. Next cache is disposable and writable by the non-root user. Future local uploads must use S3/other durable storage or a deliberately managed volume, not the container writable layer.
- **Standalone:** no custom server or unsupported standalone feature was identified. Public/static assets are copied explicitly; Mongoose stays external as configured. No application WebSocket server exists; Nginx upgrade support is ready if one is later added. Seed scripts are not part of the runtime image.
- **Existing configuration retained:** remote image patterns permit every HTTPS hostname. Restrict them to trusted image hosts in a separate app-policy change. A full abuse/rate-limit/CSRF assessment is outside this deployment change; admin login and public contact endpoints should receive traffic monitoring and appropriate edge limits before a public launch.
- **Health:** `/api/health` and Docker health checks added, independent of the database and revealing no credentials. Health checks gate deployment, not full functional acceptance.
- **Build warnings:** existing duplicate `slug` schema index declarations produce Mongoose warnings; left unchanged to avoid unrelated schema changes.
- **Validation completed:** clean `next build` with no environment files or database access passed on local Node 24. Targeted ESLint, JavaScript/shell syntax, YAML parsing, startup-config checks, JWT validation, and mocked MongoDB connection reuse/retry checks passed. The generated standalone server passed HTTP smoke checks for health JSON, missing/invalid JWT redirects behind forwarded HTTPS headers, valid JWT admin access, unauthenticated API rejection, and a public asset. Docker targets Node 22 Alpine, which still needs target-runtime verification.
- **Validation limitations:** Docker is not installed in the preparation environment; Docker/Alpine execution, Nginx configuration loading, AWS IAM/SSH access, and live HTTPS deployment must be validated on the target systems. No AWS infrastructure was provisioned.

## Change inventory

Created: `Dockerfile`, `.dockerignore`, `.env.example`, `docker-compose.yml`, `.github/workflows/deploy.yml`, `deploy/deploy.sh`, `deploy/validate-env.cjs`, `deploy/nginx/veritas.conf`, `app/api/health/route.js`, `lib/jwt.js`, `proxy.js`, and this guide.

Modified: `.gitignore`, `lib/auth.js`, `lib/mongodb.js`, `scripts/seed.js`, `scripts/seed-full.js`. Replaced `middleware.js` with `proxy.js`. `package.json` already had correct production scripts and was preserved. The pre-existing uncommitted `next.config.mjs` standalone change was preserved without further edits.
