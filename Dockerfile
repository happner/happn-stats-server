from node:4
WORKDIR /app
EXPOSE 8080
ADD . /app
RUN npm install
CMD npm start
