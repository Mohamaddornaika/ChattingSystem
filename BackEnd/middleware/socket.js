const http = require('http');
const socketIO = require('socket.io');

const server = http.createServer();
const io = socketIO(server);

server.listen(3001, () => {
  console.log('WebSocket server listening on port 3001');
});

module.exports = { server, io };
