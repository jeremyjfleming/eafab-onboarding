FROM node:18.12.1-bullseye

WORKDIR /app

COPY ./package*.json .

COPY ./tsconfig*.json .

COPY ./nest-cli.json .

COPY .env ./

COPY ./prisma .

RUN npm install

COPY . .

RUN npm run prisma:generate

RUN npm run build

CMD ["npm", "start"]