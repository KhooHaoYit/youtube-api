ARG PNPM_VERSION=8.10.0

FROM node:22-alpine AS BUILDER
RUN apk add --no-cache openssl && npm i -g pnpm@$PNPM_VERSION
WORKDIR /app
COPY pnpm-lock.yaml ./
RUN pnpm fetch
COPY package.json ./
RUN pnpm i
COPY prisma/schema.prisma prisma/schema.prisma
RUN npx prisma generate

COPY . .
RUN rm -rf src/youtube/types/test \
  && npm run build

FROM node:22-alpine AS PRODUCTION_PACKAGE
RUN apk add --no-cache openssl && npm i -g pnpm@$PNPM_VERSION
WORKDIR /app
COPY pnpm-lock.yaml ./
RUN pnpm fetch --prod
COPY package.json ./
RUN pnpm i -P
COPY prisma/schema.prisma prisma/schema.prisma
RUN npx prisma generate

FROM node:22-alpine
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=PRODUCTION_PACKAGE /app/node_modules node_modules
COPY --from=PRODUCTION_PACKAGE /app/package.json package.json
COPY --from=BUILDER /app/prisma prisma
COPY --from=BUILDER /app/dist dist
CMD ["npm", "run", "start:prod"]
