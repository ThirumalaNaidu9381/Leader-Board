import { Router } from 'express';
import User from '../models/User.js';
import ClaimHistory from '../models/ClaimHistory.js';

const router = Router();

const emitLeaderboard = async io => {
  const users = await User.find().sort({ points: -1 });
  io.emit(
    'leaderboard',
    users.map((u, i) => ({ ...u.toObject(), rank: i + 1 }))
  );
};

router.get('/', async (req, res) => {
  const users = await User.find().sort({ points: -1 });
  res.json(users.map((u, i) => ({ ...u.toObject(), rank: i + 1 })));
});

router.post('/', async (req, res) => {
  const user = await User.create({ name: req.body.name });
  await emitLeaderboard(req.io);
  res.status(201).json(user);
});

router.post('/:id/claim', async (req, res) => {
  const points = Math.floor(Math.random() * 10) + 1;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $inc: { points } },
    { new: true }
  );
  await ClaimHistory.create({ user: req.params.id, points });
  await emitLeaderboard(req.io);
  res.json({ user, points });
});

router.get('/history/:id?', async (req, res) => {
  const filter = req.params.id ? { user: req.params.id } : {};
  const history = await ClaimHistory.find(filter)
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  res.json(history);
});

export default router;
