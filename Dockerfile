FROM node:8
WORKDIR /app
EXPOSE 49494
ADD . /app
RUN npm install
CMD npm start
