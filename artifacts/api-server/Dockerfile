FROM node:22-alpine AS base
RUN npm install -g pnpm
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY lib/ ./lib/
COPY artifacts/api-server/package.json ./artifacts/api-server/
RUN pnpm install --frozen-lockfile --filter @workspace/api-server...

FROM deps AS builder
COPY lib/ ./lib/
COPY artifacts/api-server/ ./artifacts/api-server/
WORKDIR /app/artifacts/api-server
RUN pnpm run build

FROM node:22-alpine AS runner
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 menustack
WORKDIR /app

COPY --from=builder --chown=menustack:nodejs /app/artifacts/api-server/dist ./dist
COPY --from=builder --chown=menustack:nodejs /app/artifacts/api-server/package.json ./

RUN npm install -g pnpm && pnpm install --prod --ignore-scripts

USER menustack
EXPOSE 8080
ENV NODE_ENV=production PORT=8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:8080/api/healthz || exit 1

CMD ["node", "--enable-source-maps", "./dist/index.mjs"]
