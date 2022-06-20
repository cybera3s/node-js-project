// const routes = require('./routes');
// const http = require('http');

// const server = http.createServer(app);
// server.listen(3000, ()=>{
//     console.log('listening on port 3000...')
// });

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser')

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop')

app.use(bodyParser.urlencoded({extended: false}));

app.use('/admin', adminRoutes);
app.use(shopRoutes);


// handle invalid routes
app.use((req, res, nect) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
});

app.listen(3000, () => {
    console.log('listening on port 3000...')

});

