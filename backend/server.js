const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require('./src/middleware/errorHandler');
const securityMiddleware = require('./src/middleware/security');
const customAuth = require("./src/middleware/customAuth");

// Import Routes
const courseRoutes = require('./src/routes/courseRoutes');
const curriculumRoutes = require('./src/routes/curriculumRoutes');
const staffRoutes = require('./src/routes/staffRoutes');
const clubRoutes = require('./src/routes/clubRoutes');
const classroomRoutes = require('./src/routes/classroomRoutes');
const parentRoutes = require('./src/routes/parentRoutes');
const departmentRoutes = require('./src/routes/departmentRoutes');
const stakeholderRoutes = require('./src/routes/stakeholderRoutes');
const inventoryRoutes = require('./src/routes/inventoryRoutes');
const studentRoutes = require('./src/routes/studentRoutes');


// Enhanced environment validation
const requiredEnvVars = ['CLERK_SECRET_KEY', 'MONGO_URI'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

console.log('🔐 Environment Check:');
console.log('   📍 NODE_ENV:', process.env.NODE_ENV);
console.log('   🔑 CLERK_SECRET_KEY:', process.env.CLERK_SECRET_KEY ? `✅ (starts with ${process.env.CLERK_SECRET_KEY.substring(0, 10)}...)` : '❌ Missing');
console.log('   🗄️  MONGO_URI:', process.env.MONGO_URI ? '✅ Configured' : '❌ Missing');
console.log('   🌐 PORT:', process.env.PORT || 5000);

const app = express();

// Enhanced request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n📨 [${timestamp}] ${req.method} ${req.url}`);
  
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('📦 Request Body:', req.body);
  }
  
  if (req.headers.authorization) {
    console.log('🔐 Auth Header:', req.headers.authorization.substring(0, 25) + '...');
  }
  
  console.log('👤 User-Agent:', req.headers['user-agent']);
  console.log('📍 Origin:', req.headers.origin);
  
  next();
});

// Security middleware
app.use(securityMiddleware);

// CORS middleware (Production ready with Vercel support)
const allowedOrigins = [
  'http://localhost:5173', 
  'http://127.0.0.1:5173',
  // Vercel domains
  'https://scholalink.vercel.app',
  'https://scholalink-git-*.vercel.app', // For preview deployments
  'https://*.vercel.app',
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : [])
].filter(origin => origin && origin.trim());

console.log('🌐 CORS Allowed Origins:', allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check exact matches first
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Check wildcard matches for Vercel preview deployments
    if (origin.endsWith('.vercel.app')) {
      console.log('✅ Allowing Vercel preview deployment:', origin);
      return callback(null, true);
    }
    
    const msg = `🚫 CORS blocked for origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}`;
    console.warn(msg);
    return callback(new Error(msg), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token']
}));

// Body parsing middleware with limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to DB and start server
connectDB()
  .then(() => {
    console.log('🗄️  MongoDB Connected successfully');
    
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔐 Auth: ${process.env.CLERK_SECRET_KEY ? 'Clerk Configured' : 'No Auth'}`);
      console.log(`🌐 Health Check: http://localhost:${PORT}/health`);
      console.log(`📚 API Base: http://localhost:${PORT}/api`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🛑 SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('✅ Process terminated');
        process.exit(0);
      });
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });

// Public health check route (Enhanced)
app.get("/health", (req, res) => {
  const health = {
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    clerk: process.env.CLERK_SECRET_KEY ? "Configured" : "Not Configured",
    environment: process.env.NODE_ENV || 'development'
  };
  
  console.log('🏥 Health check requested');
  res.status(200).json(health);
});

// Public root route
app.get("/", (req, res) => {
  res.json({ 
    message: "Scholalink 2.0 Backend API is running...",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    documentation: "See /health for system status",
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mount PROTECTED routes with customAuth
console.log('\n🛡️  Protected Routes:');
[
  '/api/courses', '/api/curriculums', '/api/staff', '/api/clubs',
  '/api/classrooms', '/api/parents', '/api/departments', 
  '/api/stakeholders', '/api/inventory', '/api/students'
].forEach(route => {
  console.log(`   🔒 ${route}`);
});

app.use('/api/courses', customAuth, courseRoutes);
app.use('/api/curriculums', customAuth, curriculumRoutes);
app.use('/api/staff', customAuth, staffRoutes);
app.use('/api/clubs', customAuth, clubRoutes);
app.use('/api/classrooms', customAuth, classroomRoutes);
app.use('/api/parents', customAuth, parentRoutes);
app.use('/api/departments', customAuth, departmentRoutes);
app.use('/api/stakeholders', customAuth, stakeholderRoutes);
app.use('/api/inventory', customAuth, inventoryRoutes);
app.use('/api/students', customAuth, studentRoutes);

// Error handler must be last
app.use(errorHandler);

// 404 handler - MUST BE VERY LAST
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: 'Route not found',
    path: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

module.exports = app;