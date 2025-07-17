import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Health check root route
app.get('/', (_req, res) => {
  res.send('🎯 Leaderboard API running');
});

// Attach socket.io to request
app.use((req, _res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/users', userRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    server.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// Socket setup
io.on('connection', (socket) => {
  console.log('🟢 A client connected via socket');
});
