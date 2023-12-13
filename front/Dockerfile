FROM node:latest

WORKDIR /app
COPY . /app
EXPOSE 4173
RUN yarn install
RUN yarn build
CMD [ "yarn", "preview"]

