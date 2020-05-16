FROM node:12.10.0

WORKDIR /usr/app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm ci -qy
COPY . ./

EXPOSE 3000

CMD ["npm", "start"]
