const isProduction = process.env.NODE_ENV === 'production';

// Validate JWT_SECRET is set in production
if (isProduction && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required in production');
}

// Use a secure fallback for development only
const jwtSecret = process.env.JWT_SECRET || (isProduction ? '' : 'dev-secret-change-in-production');

if (!jwtSecret) {
  throw new Error('JWT_SECRET environment variable is required');
}

export const config = {
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
};
