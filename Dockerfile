FROM node:18
WORKDIR /app
COPY [ "package.json", "package-lock.json*", "./" ]
RUN npm install && npm install typescript -g
COPY . .
RUN npm run build
RUN rm -rf src
CMD [ "node", "./dist/index.js" ]
