FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY ts*.json ./
COPY src ./src/
COPY . .

RUN npm install
RUN npm run build

ENV NODE_ENV=stage
EXPOSE ${APP_PORT_STAGE}

CMD ["npx", "ts-node", "./src/index.ts"]
