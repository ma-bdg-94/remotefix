FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY ts*.json ./
COPY *.json ./
COPY src ./src/
COPY . .

RUN npm install
RUN npm install -D

RUN npm run build

ENV NODE_ENV=stage
EXPOSE ${APP_PORT_STAGE}

CMD ["npm", "run", "start:prod"]