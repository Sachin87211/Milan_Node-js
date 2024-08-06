const express = require('express');
const app = express();
const path = require('path');

require('./database/db-config')();
require('./helpers/cron');
const morgan = require('morgan');
require('dotenv').config();
const session = require("express-session");

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const cors = require('cors');
app.use(cors())

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

const userRoute = require('./routes/user-route');
const authRoutes = require('./routes/auth-routes')
app.use('/api/v1/users', userRoute);
app.use('/', authRoutes);

const port = process.env.PORT || 3500;
app.listen(port,()=>{
    console.log(`App is listening on port ${port}`);
})