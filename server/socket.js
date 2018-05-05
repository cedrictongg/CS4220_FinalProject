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
          limit: 10,
        }
      })
        .then((response) => {
          const businessData = formatResultsList(response.data.businesses);
          io.emit('successful-search', businessData);
        })
        .catch((error) => {
          console.error(error);
        });
      searches.push(searchTerms);
    });

    socket.on('search-reviews', (id) => {
      axios.get(`${config.url}${id}/reviews`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Authorization: `Bearer ${config.api_key}`
        }
      })
        .then((response) => {
          console.log('reviews!');
          const reviewData = response.data.reviews;
          io.emit('successful-reviews', reviewData);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  });
};

const formatResultsList = (results) => {
  const formatedResults = [];
  const defaultFields = {
    id: '',
    image_url: 'http://via.placeholder.com/245x180',
    name: 'Default Name',
    rating_url: '/rating/0.png',
    location: '',
    phone: '',
    review_count: 0,
    distance: '',
    categories: '',
  };

  results.forEach((restaurant) => {
    const result = Object.assign({}, defaultFields);

    result.id = restaurant.id;

    if (!hasUndefined(restaurant.image_url)) {
      result.image_url = restaurant.image_url;
    }
    if (!hasUndefined(restaurant.name)) {
      result.name = restaurant.name;
    }
    if (!hasUndefined(restaurant.rating)) {
      result.rating_url = `/rating/${restaurant.rating}.png`;
    }
    if (!hasUndefined(
      restaurant.location.address1, restaurant.location.city,
      restaurant.location.state, restaurant.location.zip_code
    )) {
      result.location = `${restaurant.location.address1}, ${restaurant.location.city}, 
      ${restaurant.location.state}, ${restaurant.location.zip_code}`;
    }
    if (!hasUndefined(restaurant.phone)) {
      result.phone = restaurant.phone;
    }
    if (!hasUndefined(restaurant.review_count)) {
      result.review_count = restaurant.review_count;
    }
    if (!isNaN(restaurant.distance)) {
      result.distance = `${(parseFloat(restaurant.distance) / 1000).toFixed(2)} km`;
    }
    if (!hasUndefined(restaurant.categories, restaurant.price)) {
      result.categories += restaurant.price;
      restaurant.categories.forEach((category) => {
        result.categories += ` - ${category.title}`;
      });
    }
    formatedResults.push(result);
  });
  return formatedResults;
};

const hasUndefined = (...args) => args.some(arg => arg === undefined);
