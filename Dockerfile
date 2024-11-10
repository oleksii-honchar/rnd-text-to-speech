#--- BASE ---
FROM tuiteraz/jaba-node:22.3-1.1.1 AS base 
# default workdir = /usr/src/app
ENV TZ=Europe/Madrid
COPY ./scripts/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["node", "--enable-source-maps", "dist/src/index.js"]

#--- BUILD ---
FROM tuiteraz/jaba-build:22.3-1.1.1 AS build
WORKDIR /tmp

COPY . .
RUN corepack enable pnpm && corepack install -g pnpm
RUN pnpm install
RUN pnpm build

#--- FINAL---
FROM base AS final
ARG IMAGE_VERSION
ARG IMAGE_NAME
ENV IMAGE_VERSION=$IMAGE_VERSION
ENV IMAGE_NAME=$IMAGE_NAME

COPY --from=build /tmp/dist ./dist
RUN corepack enable pnpm && corepack install -g pnpm
COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm i --prod
