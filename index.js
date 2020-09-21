const express = require('express');
const cors = require('cors');

const server = express();

//read config
require('dotenv').config();
console.log('Deployment: ', process.env.NODE_ENV);

//connect to database

server.use(express.json());
server.use(cors());
server.use('/contacts', require('./router'));

//Handle the wrong URLs
server.use((req, res, next) => {
    console.log('');
    res.status(404).json({"msg": "The page could not be found"});
});

//Generic error handler
server.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({"msg": "An internal error occured"});
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});