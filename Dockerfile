FROM mhart/alpine-node:14
WORKDIR /app

RUN mkdir web/ scraper/
COPY package.json yarn.lock ./
COPY web/package.json web
COPY scraper/package.json scraper
RUN yarn install --pure-lockfile --production

FROM mhart/alpine-node:14
WORKDIR /app
COPY --from=0 /app /app
RUN yarn install --pure-lockfile
COPY scraper scraper/
COPY web web/
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN cd web && yarn build

FROM mhart/alpine-node:slim-14
WORKDIR /app/web
ENV NODE_ENV=production
COPY --from=0 /app/node_modules /app/node_modules
COPY --from=1 /app/web /app/web
EXPOSE 3000
CMD ["node", "/app/web/dist/web/src/server.js"]
