module.exports = (server) => {
  const io = require('socket.io')(server);
  const moment = require('moment');
  const config = require('../config');
  const axios = require('axios');

  const searches = [];

  io.on('connection', (socket) => {

    socket.on('search-foods', (terms) => {
      const searchTerms = {
        cuisine: terms.cuisine,
        location: terms.location,
        limit: 10,
        time: moment(new Date()).format('h:mm a')
      };

      axios.get(config.url_search, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Authorization: `Bearer ${config.api_key}`
        },
        params: {
          location: terms.location,
          term: terms.cuisine,
          limit:10
        }
      })
      .then((response) => {
        //console.log(response.data.businesses);
        const businessData = response.data.businesses;
        io.emit('successful-search', businessData);
      })
      .catch((error) => {
        console.error(error);
      });
      searches.push(searchTerms);
      // io.emit('successful-search', searchTerms)
    });

//not working atm
    // socket.on('search-reviews', (id) =>{
    //   axios.get(config.url+"/"+id+"/reviews", {
    //     headers: {
    //       'X-Requested-With': 'XMLHttpRequest',
    //       Authorization: `Bearer ${config.api_key}`
    //     }
    //   })
    //   .then((response) =>{
    //     console.log("reviews!")
    //     console.log(response)
    //     const reviewData = response
    //     io.emit('successful-reviews', reviewData)
    //   })
    //   .catch((error) =>{
    //     console.error(error)
    //   })
    // })

    // socket.on('search-reviews', (restaurant) =>{
    //   const reviewTerms = {
    //     id: restaurant.id,
    //     limit:5
    //     time: moment(new Date()).format('h:mm a')
    //   };

    //   axios.get(`${config.url}/${restaurant.id}/reviews` , {
    //     headers: {
    //       'X-Requested-With': 'XMLHttpRequest',
    //       Authorization: `Bearer ${config.api_key}`
    //     },
    //     params: {
    //       location: terms.location,
    //       term: terms.cuisine,
    //       limit:5
    //     }
    //   })
    //   .then((response) =>{
    //     console.log("reviews!")
    //     console.log(response)
    //     const reviewData = response
    //     io.emit('successful-reviews', reviewData)
    //   })
    //   .catch((error) =>{
    //     console.error(error)
    //   })
    // });

  });
};
