const express = require("express");
const mongoose = require('mongoose');
const dotenv = require("dotenv");
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

dotenv.config();

const app = express();

app.use(express.json())

app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('📨 Incoming Request:', req.method, req.url);
    console.log('📦 Request Body:', req.body);
    console.log('📋 Headers:', req.headers['content-type']);
  }
  next();
});
// Security middleware
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
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Public health check route
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// Mount PROTECTED routes with customAuth
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

// ✅ ROOT ROUTE 
app.get("/", (req, res) => {
  res.send("Scholalink 2.0 Backend API is running...");
});

// Error handler must be last
app.use(errorHandler);

// 404 handler - MUST BE VERY LAST
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});