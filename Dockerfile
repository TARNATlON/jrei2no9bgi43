FROM node:latest

RUN apt-get update && \
      apt-get -y install sudo


WORKDIR /opt/roblox/

COPY . .

EXPOSE 80 443

CMD [ "npm", "run", "RunAll-Linux" ]