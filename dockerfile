# Stage 1: Build the application
FROM node:lts-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Create the production image
FROM node:lts-bookworm-slim

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm ci --only=production

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/index.js"]
