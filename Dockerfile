FROM node:22-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/shared/package.json packages/shared/
COPY packages/frontend/package.json packages/frontend/
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm --filter @vsa/frontend build

FROM node:22-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY --from=builder /app/packages/frontend/dist ./packages/frontend/dist
COPY --from=builder /app/server.js ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000
CMD ["node", "server.js"]
