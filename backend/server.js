const mongoose = require("mongoose")
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log(`MongoDB Connected`);
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error(err));
  const app = express();


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
res.send("Scholalink 2.0 Backend API is running...");
});

// Importing Routes
const courseRoutes = require('./src/routes/courseRoutes');
const curriculumRoutes = require('./src/routes/curriculumRoutes');
const staffRoutes = require('./src/routes/staffRoutes');
const clubRoutes = require('./src/routes/clubRoutes');
const classroomRoutes = require('./src/routes/classroomRoutes');
const parentRoutes = require('./src/routes/parentRoutes');
const departmentRoutes = require('./src/routes/departmentRoutes');
const stakeholderRoutes = require('./src/routes/stakeholderRoutes');
const inventoryRoutes = require('./src/routes/inventoryRoutes');

// using Routes 
app.use('/api/courses', courseRoutes);
app.use('/api/curriculums', curriculumRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/stakeholders', stakeholderRoutes);
app.use('/api/inventory', inventoryRoutes);