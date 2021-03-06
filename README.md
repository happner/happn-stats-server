# happn-stats-server

All-in-one docker HappnStats server

See `docker-compose.yml`

* Runs elasticsearch.
* Runs kibana.
* Runs a [happn-stats](https://github.com/happner/happn-stats) server with [happn-stats-elasticsearch](https://github.com/happner/happn-stats-elasticsearch) plugin.
* Runs a proxy to provide authenticated (htpasswd) access to kibana. It is assumed that SSL services will be provided by an upstream proxy / load balancer. **The proxy listens at port 8080.**



### 1. Install from Github

```
git clone https://github.com/happner/happn-stats-server.git
cd happn-stats-server
```

**NB** - All the following commands must be performed in the repo's root directory where the relevant `docker-compose.yml` file is located.



### 2. Add/Reset proxy passwords

Use the `htpasswd` utility to add/modify users.

Adding users after starting the services will require a restart of the proxy: `docker-compose restart proxy`

```
# on ubuntu the htpasswd util is part of apache2-utils
# sudo apt-get install apache2-utils

# first user, -c to create file
htpasswd -c www/users.htpasswd yourusername

# subsequent users, NB not -c
htpasswd www/users.htpasswd username

```



### 3. Install and start the services

```
# requires sudo on linux

docker-compose create
docker-compose build
docker-compose start

Bug: If "No such network" error, try "sudo docker-compose up" and then kill it after a while. Then do the start again.
```

That will also have them restart at system reboot provided the docker service itself is configured as such.

Note: The happn-stats service will silently fail a few times and then succeed when the elasticseach service is up.



### 4. Debugging

Use the service name from the `docker-compose.yml`

```
docker-compose logs --follow happn-stats
```

More: [https://docs.docker.com/compose/reference/overview/](https://docs.docker.com/compose/reference/overview/)



### 5. Assign kibana index pattern

[http://localhost:8080](http://localhost:8080)

Select `happn-stats` as kibana "index pattern" and `timestamp` as the "Time Filter field name"



### 6. Create timelion graphs

These are built-in happn-stats metrics (in kibana 6.0.0 .es() statements are delimityd by comma)

```
// happn-stats fragments per second
.es(index=happn-stats, timefield='timestamp', metric='avg:_fragments').lines(width=1.5).color('orange').label('Fragments per Second'),

// happn-stats bytes per second
.es(index=happn-stats, timefield='timestamp', metric='avg:_bytes').lines(width=1.5).color('orange').label('Bytes per Second'), 

// happn-stats connected clients
.es(index=happn-stats, timefield='timestamp', metric='avg:_clients').lines(width=1.5).color('orange').label('Connected Clients'), 
```



### 7. Instrument your application

Increment counters and set gauges using the [happn-stats client](https://github.com/happner/happn-stats#example1).

#  

### ?. Uninstall

```
docker-compose stop
docker-compose rm
```

### xxx. Per service restarting

Per service names in `docker-compose.yml`

```
docker-compose restart proxy
docker-compose stop proxy
docker-compose start proxy
```

### xxx. Modify code or config of particular service

```
docker-compose stop happn-stats
docker-compose rm happn-stats
// modify
docker-compose build happn-stats
docker-compose create happn-stats
docker-compose start happn-stats
```

