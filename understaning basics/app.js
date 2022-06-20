// const routes = require('./routes');
// const http = require('http');

// const server = http.createServer(app);
// server.listen(3000, ()=>{
//     console.log('listening on port 3000...')
// });


const express = require('express');
const bodyParser = require('body-parser')

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop')

app.use(bodyParser.urlencoded({extended: false}));
app.use(adminRoutes);
app.use(shopRoutes);


app.listen(3000, () => {
    console.log('listening on port 3000...')

});

