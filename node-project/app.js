const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');


const app = express();

// template engine config

app.set('view engine', 'ejs');
app.set('views', 'views');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop')

// Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', adminRoutes);
app.use(shopRoutes);


// handle 404 page
app.use(errorController.get404);

sequelize.sync().then(result => {
    // console.log(result)
    app.listen(3000, () => {
        console.log('listening on port 3000...')
    });
}).catch(err => {
    console.log(err);
});



