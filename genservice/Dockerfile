# nvg-genservice — HTTP wrapper over the CANONICAL Novagentica generators.
#
# SINGLE SOURCE: the generator scripts are NOT copied into this folder. They live in
# skills/ and are pulled straight from there at build time, so the service can never
# drift from the skills. Because of that, this image MUST be built from the REPO ROOT:
#
#   docker build --platform linux/amd64 -f genservice/Dockerfile -t nvg-genservice .
#
# Deployable to AWS Frankfurt (eu-central-1) — App Runner / Fargate / ECS — keeping all
# rendering in-region, no US data path, consistent with the platform posture.
FROM node:20-slim
WORKDIR /app

COPY genservice/package.json ./
RUN npm install --omit=dev

COPY genservice/server.js ./
# Canonical generators, pulled from the skills (one source of truth):
COPY skills/novagentica-engagement-pack/assets/generators ./generators
COPY skills/novagentica-order-form/scripts ./orderforms

ENV PORT=8080
EXPOSE 8080
# NVG_TOKEN must be supplied at runtime (shared secret with n8n's HTTP Request node).
CMD ["node", "server.js"]
