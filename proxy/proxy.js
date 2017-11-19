#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var http = require('http');
var auth = require('http-auth');
var httpProxy = require('http-proxy');

var basic, proxy, server;

try {
  // mounted in docker to ./www
  basic = auth.basic({
    file: '/var/www/users.htpasswd'
  });
} catch (e) {
  basic = auth.basic({
    file: path.resolve(__dirname, '..', 'www', 'users.htpasswd')
  });
}

proxy = httpProxy.createProxyServer();

server = http.createServer(basic, function (req, res) {
  proxy.web(req, res, {
    target: 'http://kibana:5601'
  });
});

server.listen(8080);
