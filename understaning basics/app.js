// const routes = require('./routes');
// const http = require('http');

const express = require('express');
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use('/add-product', (req, res, next) => {
    res.send('<form action="/product" method="POST"><input type="text" name="title"><input type="submit"></form>');
});

app.use('/product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/')
});

app.use('/', (req, res, next) => {
    res.send('<h1>hi there</h1>');
});

app.listen(3000, () => {
    console.log('listening on port 3000...')

});


// const server = http.createServer(app);
// server.listen(3000, ()=>{
//     console.log('listening on port 3000...')
// });