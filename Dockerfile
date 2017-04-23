FROM zixia/wechaty
WORKDIR /bot
COPY ./dist/ .
COPY package.json .
RUN npm install 

ENTRYPOINT [ ]
CMD [ "node","index.js" ]