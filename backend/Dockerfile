# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY tsconfig*.json nest-cli.json ./
COPY src ./src
RUN npm run build

# ---- production stage ----
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY --from=build /app/dist ./dist
EXPOSE 3001
# runtime env only — no .env baked into the image
CMD ["sh", "-c", "node dist/migrate.js && node dist/main.js"]
