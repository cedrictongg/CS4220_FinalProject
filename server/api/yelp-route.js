const yelp = require('yelp')
const express = require('express')
const router = express.Router()

module.exports = () => {
  // /api/search/?term=`${term}`&location=`${location}`
  router.get('/api/search/', (req, res) => {
    yelp.search(req.query)
    .then(result => {
      let json = JSON.parse(result)
      res.send(json)
    })
  })
  return router
}
