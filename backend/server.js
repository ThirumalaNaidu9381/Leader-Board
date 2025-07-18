import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';

import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST'],
  credentials: true
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Attach io to app
app.set('io', io);

// 🔥 Middleware to make io available in routes via req.io
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/users', userRoutes);

// Socket.io events
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
