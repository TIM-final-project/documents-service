FROM node:14 as build

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i @nestjs/core @nestjs/common rxjs reflect-metadata
RUN npm ci
COPY . .
RUN npm run build


FROM node:14-alpine as main

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
EXPOSE 3003
CMD [ "node", "dist/main.js" ]