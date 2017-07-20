## Running DOMUSTO server

```
$ npm run start
```

## Running DOMUSTO server with auto reload on changes
```
$ ./node_modules/.bin/nodemon src/server.js
```

# Setup

## Installing and upgrading NPM / Nodejs on RPI

By default the node package in Raspian is very old:

```
$ npm -v
1.4.21
$ node -v
v0.10.29
```

To upgrade to the latest node / npm:

```
$ curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
$ sudo apt install nodejs
apt-get install nodejs

node -v
v8.1.4
$ npm -v
5.0.3
```

source: http://thisdavej.com/beginners-guide-to-installing-node-js-on-a-raspberry-pi/

## Install npm packages
```
$ npm install
```