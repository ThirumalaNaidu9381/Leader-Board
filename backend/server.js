import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL } });

app.use((req, _res, next) => {
  req.io = io;
  next();
});
app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  server.listen(process.env.PORT || 5000);
});

io.on('connection', () => {});
