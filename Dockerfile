# Use the official Wechaty onbuild image as the base
FROM zixia/wechaty:onbuild
#WORKDIR /bot
FROM zixia/wechaty:onbuild
# Create a data directory inside the container
RUN mkdir -p /bot/data
# Copy the whole project into the container
ADD ./ /bot
#CMD [ "npm","start" ]
