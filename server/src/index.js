require('dotenv').config();           // Load .env variables
const http = require('http');         // Node HTTP server
const app = require('./app');         // Express app
const connectDB = require('./config/db');    // MongoDB connection
const { initSocket } = require('./socket'); // Socket.IO setup (optional)

const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO (optional for real-time updates)
if (initSocket) {
  initSocket(server);
}

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('JWT_SECRET =', process.env.JWT_SECRET);

});
