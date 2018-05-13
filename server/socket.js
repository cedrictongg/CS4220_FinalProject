module.exports = (server) => {
  const io = require('socket.io')(server);
  const yelp = require('../yelp')

  const searches = [];

  io.on('connection', (socket) => {
    socket.on('search-foods', (terms) => {
      const searchTerms = {
        cuisine: terms.cuisine,
        location: terms.location,
        limit: terms.limit
      };
      // 
      // yelp.search(searchTerms).then(res => {
      //   let json = JSON.parse(res)
      //   io.emit('successful-search', formatResultsList(json.businesses))
      //   console.log('emit successful-search')
      // })

      searches.push(searchTerms)
      io.emit('search-history', searches)
    });

    // socket.on('search-reviews', (id) => {
    //   axios.get(`${config.url}${id}/reviews`, {
    //     headers: {
    //       'X-Requested-With': 'XMLHttpRequest',
    //       Authorization: `Bearer ${config.api_key}`,
    //     },
    //   })
    //     .then((response) => {
    //       console.log('reviews!');
    //       const reviewData = response.data.reviews;
    //       reviewData.forEach((review) => {
    //         if (review.user.image_url == null) {
    //           review.user.image_url = `http://via.placeholder.com/75?text=${review.user.name}`;
    //         }
    //       });
    //       io.emit('successful-reviews', reviewData);
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // });

    socket.on(`search-reviews`, (id) =>{
      yelp.reviews(id).then(res => {
        let json = JSON.parse(res)
        io.emit('successful-reviews')
      })
    })

    socket.on('redo-search', (redo) => {
      yelp.search(redo).then(res => {
        let json = JSON.parse(res)
        io.emit('successful-search', formatResultsList(json.businesses))
      })
    })
  });
};

const formatResultsList = (results) => {
  const formatedResults = []
  const defaultFields = {
    id: '',
    image_url: 'http://via.placeholder.com/245x180',
    name: 'Default Name',
    rating_url: '/rating/0.png',
    location: '',
    phone: '',
    review_count: 0,
    distance: '0 KM',
    categories: '',
  }

  results.forEach((restaurant) => {
    const result = Object.assign({}, defaultFields)

    result.id = restaurant.id
      result.name = restaurant.name

    if (!hasUndefined(restaurant.image_url)) {
      result.image_url = restaurant.image_url
    }
    if (!hasUndefined(restaurant.rating)) {
      result.rating_url = `/rating/${restaurant.rating}.png`
    }
    if (!hasUndefined(restaurant.location.address1, restaurant.location.city,restaurant.location.state, restaurant.location.zip_code)) {
      result.location = `${restaurant.location.address1}, ${restaurant.location.city}, ${restaurant.location.state}, ${restaurant.location.zip_code}`
    }
    if (!hasUndefined(restaurant.phone)) {
      result.phone = restaurant.phone
    }
    if (!hasUndefined(restaurant.review_count)) {
      result.review_count = restaurant.review_count
    }
    if (!isNaN(restaurant.distance)) {
      result.distance = `${(parseFloat(restaurant.distance) / 1000).toFixed(2)} km`
    }
    if (!hasUndefined(restaurant.categories, restaurant.price)) {
      result.categories += restaurant.price
      restaurant.categories.forEach((category) => {
        result.categories += ` - ${category.title}`
      })
    }
    formatedResults.push(result)
  })
  return formatedResults
}

const hasUndefined = (...args) => {
  return args.some( arg => {
    return arg === undefined
  })
}
