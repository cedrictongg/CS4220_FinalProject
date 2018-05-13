const config = require('../config')
const rp = require('request-promise')

const fetch = (params, command) => {
  console.log('searching')
  return rp({url: `${config.url}${command}`,
    qs: params,
    headers: {'Authorization': `Bearer ${config.api_key}`}})
    .then(res => res)
    .error(err => {
      console.error(err)
    })
  }

exports.search = searchTerms => {
  console.log(searchTerms)
  let params = {
      location: searchTerms.location,
      term: searchTerms.term,
      limit: searchTerms.limit
    }
  return fetch(params, 'search')
}
