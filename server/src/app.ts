import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { authRoutes } from './routes/auth.routes';
import { userRoutes } from './routes/user.routes';
import { postRoutes } from './routes/post.routes';
import { friendRoutes } from './routes/friend.routes';
import { clanRoutes } from './routes/clan.routes';
import { tournamentRoutes } from './routes/tournament.routes';
import { notificationRoutes } from './routes/notification.routes';
import { adminRoutes } from './routes/admin.routes';
import { errorHandler } from './middleware/error.middleware';
import { rateLimiter } from './middleware/rateLimit.middleware';

export const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('tiny'));
app.use(rateLimiter);

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', version: '1.0.0' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/clans', clanRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);
