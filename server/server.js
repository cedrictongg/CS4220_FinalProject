const express = require('express');
const path = require('path');

const app = express();
const server = require('http').Server(app);

app.use(express.static(path.join(__dirname, '..', '/client')));
app.use(require('./api/yelp-route')());
require('./socket')(server);

server.listen(8080);
