import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';

dotenv.config();

const server = Fastify({
  logger: true,
});

// Register CORS
await server.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
});

// Health check route
server.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// API routes will go here
server.get('/api', async () => {
  return { message: 'Airbnb Clone API' };
});

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '8000', 10);
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`Server running on http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
