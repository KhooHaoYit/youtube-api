ARG PNPM_VERSION=8.3.1

FROM node:18-alpine AS BUILDER
RUN npm i -g pnpm@$PNPM_VERSION
WORKDIR /app
COPY pnpm-lock.yaml ./
RUN pnpm fetch
COPY package.json ./
RUN pnpm i --offline
COPY prisma/schema.prisma prisma/schema.prisma
RUN npx prisma generate

COPY . .
RUN rm -rf src/youtube/types/test \
  && npm run build

FROM node:18-alpine AS PRODUCTION_PACKAGE
RUN npm i -g pnpm@$PNPM_VERSION
WORKDIR /app
COPY pnpm-lock.yaml ./
RUN pnpm fetch --prod
COPY package.json ./
RUN pnpm i -P --offline
COPY prisma/schema.prisma prisma/schema.prisma
RUN npx prisma generate

FROM node:18-alpine
WORKDIR /app
COPY --from=PRODUCTION_PACKAGE /app/node_modules node_modules
COPY --from=PRODUCTION_PACKAGE /app/package.json package.json
COPY --from=BUILDER /app/prisma prisma
COPY --from=BUILDER /app/dist dist
CMD ["npm", "run", "start:prod"]
