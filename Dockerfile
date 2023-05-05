FROM node:18 as builder

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn --omit=dev --ignore-scripts

COPY . .

RUN yarn build

FROM node:18

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

# COPY .env.example .env
# COPY .env.default .env.production
# COPY .env.default .env.staging
# COPY .env.default .env.test

COPY jvm-config.js .

RUN yarn --production

COPY --from=builder /app/dist ./dist

EXPOSE 9000

ENTRYPOINT ["node", "dist/index.js"]