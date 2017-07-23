This project is pre-pre-pre-alpha, so don't expect a working solution.

# API docs

See [the API docs](API.MD)

# Running the DOMUSTO server

## Normal

```
$ cd src
$ npm run start
```

## Running DOMUSTO server with auto reload on changes
```
$ cd src
$ ../node_modules/.bin/nodemon server.js
```

# Setup

## Installing and upgrading NPM / Nodejs on RPI

By default the node package in Raspian is very old:

```
$ npm -v
1.4.21
```

```
$ node -v
v0.10.29
```

To upgrade the RPI to the latest node / npm:

```
$ curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
$ sudo apt install nodejs
$ apt-get install nodejs
```

The new versions should became: (or higher)
```
node -v
v8.1.4
```

```
$ npm -v
5.0.3
```

source: http://thisdavej.com/beginners-guide-to-installing-node-js-on-a-raspberry-pi/

## Install npm packages
```
$ npm install
```