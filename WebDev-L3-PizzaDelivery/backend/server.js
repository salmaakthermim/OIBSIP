import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import pizzaRoutes from './src/routes/pizzaRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import ingredientRoutes from './src/routes/ingredientRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import { seedDatabase } from './src/utils/seedData.js';
import { startStockCheckJob } from './src/jobs/stockCheck.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  },
});

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Ensure DB is connected before processing requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Seed DB on startup if needed
connectDB().then(() => seedDatabase());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pizzas', pizzaRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'PizzaHub API running' }));

// Socket.IO
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('joinOrderRoom', (orderId) => socket.join(`order_${orderId}`));
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

app.set('io', io);

// Start cron job
startStockCheckJob();

const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
