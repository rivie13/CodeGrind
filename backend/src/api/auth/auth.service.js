import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const authService = {
  async login(username, password) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: username }
        ]
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return { token, user: this.sanitizeUser(user) };
  },

  async register(userData) {
    const { username, email, password } = userData;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return { token, user: this.sanitizeUser(user) };
  },

  sanitizeUser(user) {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  },

  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        stats: true,
        activities: {
          orderBy: { timestamp: 'desc' },
          take: 10, // Get last 10 activities
        },
        achievements: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Calculate success rate
    const successRate = user.stats
      ? Math.round((user.stats.problemsSolved / user.stats.totalAttempts) * 100) || 0
      : 0;

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      stats: {
        problemsSolved: user.stats?.problemsSolved || 0,
        easySolved: user.stats?.easySolved || 0,
        mediumSolved: user.stats?.mediumSolved || 0,
        hardSolved: user.stats?.hardSolved || 0,
        successRate,
        streak: user.stats?.streak || 0,
      },
      recentActivity: user.activities.map(activity => ({
        id: activity.id,
        problem: activity.problemName,
        status: activity.type,
        date: activity.timestamp,
      })),
      achievements: user.achievements.map(achievement => ({
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        unlockedAt: achievement.unlockedAt,
      })),
    };
  },

  async updateProfile(userId, updateData) {
    const { username, email, bio } = updateData;

    // Check if username or email is already taken
    if (username || email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            username ? { username } : null,
            email ? { email } : null,
          ].filter(Boolean),
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        throw new Error('Username or email already taken');
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        email,
        bio,
      },
      include: {
        stats: true,
        activities: {
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
        achievements: true,
      },
    });

    return this.getProfile(userId);
  },
}; 