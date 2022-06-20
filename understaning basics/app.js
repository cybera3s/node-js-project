// const routes = require('./routes');

const http = require('http');

const express = require('express');

const app = express();

const server = http.createServer(app);

console.log('listening on port 3000...')
server.listen(3000);