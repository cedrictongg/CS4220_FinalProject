const config = require('../config');
const rp = require('request-promise');

const fetch = (params, command) => rp({
  url: `https://api.yelp.com/v3/businesses/${command}`,
  qs: params,
  headers: { Authorization: `Bearer ${config.api_key}` }
})
  .then(res => res);

exports.search = (searchTerms) => {
  console.log('searching');
  const params = {
    location: searchTerms.location,
    term: searchTerms.term,
    limit: searchTerms.limit,
  };
  return fetch(params, 'search');
};

exports.reviews = (business) => {
  console.log('getting reviews');
  return fetch({}, `${business.id}/reviews`);
};
