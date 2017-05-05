FROM zixia/wechaty:onbuild
#WORKDIR /bot
FROM zixia/wechaty:onbuild
RUN mkdir -p /bot/data
ADD ./ /bot
#CMD [ "npm","start" ]
