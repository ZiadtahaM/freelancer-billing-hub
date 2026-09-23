FROM node:22-alpine AS base
RUN npm install -g pnpm
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY lib/ ./lib/
COPY artifacts/menustack/package.json ./artifacts/menustack/
RUN pnpm install --frozen-lockfile --filter @workspace/menustack...

FROM deps AS builder
COPY lib/ ./lib/
COPY artifacts/menustack/ ./artifacts/menustack/
WORKDIR /app/artifacts/menustack
ENV NODE_ENV=production
RUN pnpm run build

FROM nginx:1.27-alpine AS runner
COPY artifacts/menustack/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/artifacts/menustack/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://localhost/healthz || exit 1
CMD ["nginx", "-g", "daemon off;"]
