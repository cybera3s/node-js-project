// const routes = require('./routes');
// const http = require('http');

// const server = http.createServer(app);
// server.listen(3000, ()=>{
//     console.log('listening on port 3000...')
// });

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const engine = hbs.create({ 
    layoutsDir: "views/layouts/",
    defaultLayout: "main-layout",
    extname: 'hbs'
});


const app = express();

// template engine config

// app.set('view engine', 'pug');
app.engine('hbs', engine.engine)
app.set('view engine', 'hbs');
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
    // sendFile(path.join(__dirname, 'views', '404.html'))
});

app.listen(3000, () => {
    console.log('listening on port 3000...')
});

