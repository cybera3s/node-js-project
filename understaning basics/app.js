const http = require('http');

// approach 1
// function rqListener(req, res){

// }

// approach 2
// http.createServer(function(req, res){

// })

// approach 3

const server = http.createServer((req, res) => {
    console.log(req)
});

server.listen(3000);