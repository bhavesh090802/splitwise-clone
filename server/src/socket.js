let io;

function initSocket(server) {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:4200',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on('join-group', (groupId) => {
      socket.join(groupId);
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected', socket.id);
    });
  });
}

function getIO() {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}

module.exports = { initSocket, getIO };
