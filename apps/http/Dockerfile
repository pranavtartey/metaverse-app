FROM node:20.18.0-alpine3.20 as base

FROM base as builder

WORKDIR /backend

COPY package*.json .

COPY tsconfig.json .

RUN npm install pnpm

RUN pnpm install

COPY /src .

RUN npm run build

FROM base as runner

COPY --from=builder package*.json .

COPY --from=builder /dist .

RUN pnpm install

CMD ["npm","start"]