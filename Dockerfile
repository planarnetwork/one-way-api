FROM node:11

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm ci --only=production
COPY ./dist/ ./dist/

EXPOSE 8080

CMD [ "npm", "run", "start-js" ]

HEALTHCHECK --interval=30s --timeout=1s \
  CMD curl -f http://localhost:8080/health || exit 1
