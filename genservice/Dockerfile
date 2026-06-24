# Deployable to AWS Frankfurt (eu-central-1) — App Runner / Fargate / ECS — keeping
# all rendering in-region, no US data path, consistent with the platform posture.
FROM node:20-slim
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY server.js ./
COPY generators ./generators
COPY orderforms ./orderforms
ENV PORT=8080
EXPOSE 8080
# NVG_TOKEN must be supplied at runtime (shared secret with n8n's HTTP Request node).
CMD ["node", "server.js"]
