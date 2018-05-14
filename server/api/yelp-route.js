const yelp = require('yelp');
const express = require('express');

const router = express.Router();

module.exports = () => {
  // /api/search/?term=`${term}`&location=`${location}`
  router.get('/api/search/', (req, res) => {
    yelp.search(req.query)
      .then((result) => {
        const json = JSON.parse(result);
        res.send(json);
      });
  });

  router.get('/api/reviews/', (req, res) => {
    yelp.reviews(req.query)
      .then((result) => {
        console.log(result);
        res.send(JSON.parse(result));
      });
  });
  return router;
};
