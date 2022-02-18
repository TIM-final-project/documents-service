FROM node:14-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i -g @nestjs/cli
RUN npm ci --only=production
COPY . .
EXPOSE 3003
CMD [ "npm", "run", "start" ]