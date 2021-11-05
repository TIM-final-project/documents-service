FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i -g @nestjs/cli
RUN npm install --only=prod
COPY . .
EXPOSE 3003
CMD [ "npm", "run", "start" ]