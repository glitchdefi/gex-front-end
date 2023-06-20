FROM node:lts

COPY . /app
WORKDIR /app

# RUN npm install --global yarn --force

RUN yarn install
RUN yarn run build

CMD ["yarn","start"]