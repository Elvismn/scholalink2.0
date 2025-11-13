const express = require("express");
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
// const { clerkMiddleware, requireAuth } = require('@clerk/express');
const errorHandler = require('./src/middleware/errorHandler'); // ✅ UNCOMMENTED
const securityMiddleware = require('./src/middleware/security'); // ✅ UNCOMMENTED
const customAuth = require("./src/middleware/customAuth")

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

dotenv.config();

const app = express();

// Security middleware ✅ UNCOMMENTED
app.use(securityMiddleware);

// Connect to DB first
connectDB()
  .then(() => {
    console.log(`MongoDB Connected`);

    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error(err));

// Middleware
app.use(cors());
app.use(express.json());

// // Clerk middleware - attaches auth to req.auth
// app.use(clerkMiddleware());

// Public health check route
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// Mount PROTECTED routes - require authentication
app.use('/api/courses', customAuth, courseRoutes);
app.use('/api/curriculums', customAuth, curriculumRoutes);
app.use('/api/staff', customAuth, staffRoutes);
app.use('/api/clubs', customAuth, clubRoutes);
app.use('/api/classrooms', customAuth, classroomRoutes);
// Temporary debug middleware to see what's happening
app.use('/api/parents', (req, res, next) => {
  console.log('🔐 Auth check for /api/parents');
  console.log('Headers:', req.headers);
  next();
}, customAuth, parentRoutes);
app.use('/api/departments', customAuth, departmentRoutes);
app.use('/api/stakeholders', customAuth, stakeholderRoutes);
app.use('/api/inventory', customAuth, inventoryRoutes);

// ✅ ROOT ROUTE 
app.get("/", (req, res) => {
  res.send("Scholalink 2.0 Backend API is running...");
});

// Error handler must be last ✅ UNCOMMENTED
app.use(errorHandler);

// 404 handler - MUST BE VERY LAST
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});