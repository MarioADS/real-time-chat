const express = require('express');
const app = express();

app.set('port', process.env.PORT || 7070);
const server = app.listen(app.get('port'), () => console.log('Server Up!'));

const Socket = require('socket.io');
const io = Socket(server);

io.on('connect', require('./server/server_chat'));