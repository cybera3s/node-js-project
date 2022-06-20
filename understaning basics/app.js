// const routes = require('./routes');
// const http = require('http');

const express = require('express');
const app = express();


app.use('/', (req, res, next) => {
    console.log('this always run')
    next();
});


app.use('/add-product', (req, res, next) => {
    console.log('in the another middleware ')
    res.send('<h1>add product page</h1>');
});

app.use('/', (req, res, next) => {
    console.log('in the another middleware ')
    res.send('<h1>hi there</h1>');
});

app.listen(3000, () => {
    console.log('listening on port 3000...')

});


// const server = http.createServer(app);
// server.listen(3000, ()=>{
//     console.log('listening on port 3000...')
// });