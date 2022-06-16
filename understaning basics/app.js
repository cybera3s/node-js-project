const http = require('http');

// approach 1
// function rqListener(req, res){

// }

// approach 2
// http.createServer(function(req, res){

// })

// approach 3

const server = http.createServer((req, res) => {
    // console.log(req.url, req.method, req.headers);
    // process.exit();
    res.setHeader('Content-Type', 'text/html')
    res.write('<html>')
    res.write('<head><title>App Node JS</title></head>')
    res.write('<body><h1>Hello ario</h1></body>')
    res.write('</html>')
    res.end();

});

server.listen(3000);