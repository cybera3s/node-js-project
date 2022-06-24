// const routes = require('./routes');
// const http = require('http');

// const server = http.createServer(app);
// server.listen(3000, ()=>{
//     console.log('listening on port 3000...')
// });

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// template engine config

app.set('view engine', 'ejs');
app.set('views', 'views');


const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop')

// Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', adminData.routes);
app.use(shopRoutes);


// handle invalid routes
app.use((req, res, next) => {
    res.status(404).render('404', 
        {
            pageTitle: "404 Page",
    });
});

app.listen(3000, () => {
    console.log('listening on port 3000...')
});

