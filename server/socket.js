module.exports = (server) => {
  const io = require('socket.io')(server);

  const searches = [];

  io.on('connection', (socket) => {
    socket.on('search-foods', (terms) => {
      const searchTerms = {
        cuisine: terms.cuisine,
        location: terms.location,
        limit: terms.limit,
      };
      searches.push(searchTerms);
      io.emit('search-history', searches);
    });
  });
};
