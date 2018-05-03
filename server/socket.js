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
        time: moment(new Date()).format('h:mm a')
      };

      axios.get(config.url, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Authorization: `Bearer ${config.api_key}`
        },
        params: {
          location: terms.location,
          term: terms.cuisine
        }
      })
        .then((response) => {
          console.log(response.data.businesses);
          const businessData = response.data.businesses;
          io.emit('successful-search', businessData);
        })
        .catch((error) => {
          console.error(error);
        });
      searches.push(searchTerms);
      // io.emit('successful-search', searchTerms)
    });
  });
};
