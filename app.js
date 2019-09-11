const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const timerSettings = require('./routes/settings');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const keys = require('./config/keys');
const passport = require('passport');
const app = express();

// Connecting to mongoDB (Code from mongo.DB.Atlas)
// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://user:user@clustertimer-bf6oz.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true,
//     useUnifiedTopology: true
//  });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(() => console.log('MongodB connected'))
.catch(error => console.log(error));

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/settings', timerSettings);

module.exports = app;