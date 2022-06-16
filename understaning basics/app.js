const http = require('http');

// approach 1
// function rqListener(req, res){

// }

// approach 2
// http.createServer(function(req, res){

// })

// approach 3

const server = http.createServer((req, res) => {

    const url = req.url;
    // check if url is '/'
    if (url === '/') {
        res.write('<html>')
        res.write('<head><title>Enter Message</title></head>')
        res.write('<body><form action="/message" method="POST"><input name="message" type="text"><input type="submit"></form></body>')
        res.write('</html>')
        return res.end();
    }

    res.setHeader('Content-Type', 'text/html')
    res.write('<html>')
    res.write('<head><title>App Node JS</title></head>')
    res.write('<body><h1>Hello ario</h1></body>')
    res.write('</html>')
    res.end();

});

server.listen(3000);