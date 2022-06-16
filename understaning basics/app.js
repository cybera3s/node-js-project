const http = require('http');
const routes = require('./routes');


console.log(routes.someText)

const server = http.createServer(routes.handler);

console.log('listening on port 3000...')
server.listen(3000);