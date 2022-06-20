// const routes = require('./routes');

const http = require('http');

const express = require('express');

const app = express();



app.use((req, res, next) => {
    console.log('in the middleware ')
    next(); // alows the request to continue to the next middleware in line
});

app.use((req, res, next) => {
    console.log('in the another middleware ')
    
});

const server = http.createServer(app);



server.listen(3000, ()=>{
    console.log('listening on port 3000...')
});