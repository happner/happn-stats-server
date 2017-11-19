#!/usr/bin/env node

var http = require('http');
var auth = require('http-auth');
var httpProxy = require('http-proxy');

var basic, proxy, server;

basic = auth.basic({
  // mounted in docker container
  file: '/var/www/users.htpasswd'
});

proxy = httpProxy.createProxyServer();

server = http.createServer(basic, function (req, res) {
  proxy.web(req, res, {
    // hostname resolvable in docker container
    // (per docker-compose service name)
    target: 'http://kibana:5601'
  });
});

server.listen(8080);
