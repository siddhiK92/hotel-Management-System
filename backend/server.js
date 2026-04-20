require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/tables', require('./routes/tables'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/delivery', require('./routes/delivery'));

// Socket.io for real-time
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('order:new', (data) => io.emit('order:update', data));
  socket.on('table:update', (data) => io.emit('table:refresh', data));
  socket.on('disconnect', () => console.log('Client disconnected'));
});

// Make io accessible to routes
app.set('io', io);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hotelms';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    // Start server anyway for demo
    server.listen(PORT, () => console.log(`Server running on port ${PORT} (no DB)`));
  });

module.exports = { app, io };
