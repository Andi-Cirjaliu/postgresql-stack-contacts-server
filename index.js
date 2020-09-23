const express = require('express');
const cors = require('cors');
const {counterRequests} = require('./metrics');

const server = express();

//read config
require('dotenv').config();
console.log('Environment: ', process.env.NODE_ENV);

//connect to database

server.use(express.json());
server.use(cors());

server.use(async (req, res, next) => {
  //get total contacts
  if ( req.url !== '/metrics' ) {
    // counterRequestsTotal.inc();
    counterRequests.labels('total').inc();
  }
  next();
});

server.use(require('./routerMetrics'));
server.use('/contacts', require('./router'));

//Handle the wrong URLs
server.use((req, res, next) => {
    console.log('Not found ', req.url);
    // counterRequestsNotFound.inc();
    counterRequests.labels('page not found').inc();
    res.status(404).json({"msg": "The page could not be found"});
});

//Generic error handler
server.use(function (err, req, res, next) {
  console.error('An unhandled error occured: ', err.stack);
  counterRequests.labels('internal error').inc();
  res.status(500).json({"msg": "An internal error occured"});
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});