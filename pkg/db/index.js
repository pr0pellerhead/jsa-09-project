const mongoose = require('mongoose');
const config = require('../config');

const username = config.get('db').username;
const password = config.get('db').password;
const host = config.get('db').host; //cluster0.xyz123.mongodb.net
const dbname = config.get('db').dbname;

mongoose.connect(
    `mongodb+srv://${username}:${password}@${host}/${dbname}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    err => {
        if(err) {
            return console.log('Could not connect to DB', err);
        }
        console.log('Successfully connected to database');
    }
);