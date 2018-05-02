module.exports = server => {
  const
    io = require('socket.io')(server),
    moment = require('moment')

  let searches = []

  io.on('connection', socket => {
    socket.on('search-foods', terms => {
      const searchTerms = {
        cuisine: terms.cuisine,
        location: terms.location,
        time: moment(new Date()).format('h:mm a')
      }
      searches.push(searchTerms)
      io.emit('successful-search', searchTerms)
    })
  })
}
