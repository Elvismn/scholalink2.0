# Scholalink 2.0 Backend

A comprehensive Node.js/Express backend API for school management systems, providing full CRUD operations for students, staff, courses, classrooms, departments, and more. Built with security, scalability, and ease of use in mind.

## Features

- **User Authentication**: Integrated with Clerk for secure authentication and authorization
- **Database Management**: MongoDB with Mongoose ODM for robust data handling
- **RESTful API**: Complete CRUD operations for all school entities
- **Security**: Helmet for security headers, rate limiting, CORS configuration
- **Error Handling**: Centralized error handling middleware
- **Health Checks**: Built-in health check endpoint for monitoring
- **Development Tools**: Nodemon for hot reloading during development

### Supported Entities

- Students
- Staff
- Courses
- Curriculums
- Classrooms
- Clubs
- Parents
- Departments
- Stakeholders
- Inventory

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5.1.0
- **Database**: MongoDB with Mongoose v8.19.3
- **Authentication**: Clerk SDK
- **Security**: Helmet, Express Rate Limit
- **Development**: Nodemon
- **Other**: CORS, Dotenv

## Prerequisites

Before running this application, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB (local or cloud instance)
- Clerk account for authentication

## Installation

1. Clone the repository and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install all dependencies using npm:
   ```bash
   npm install
   ```

   This will install the following packages:
   - `@clerk/clerk-sdk-node`: ^4.13.23 - Clerk Node.js SDK
   - `@clerk/express`: ^1.7.48 - Clerk Express middleware
   - `cors`: ^2.8.5 - Cross-Origin Resource Sharing
   - `dotenv`: ^17.2.3 - Environment variable management
   - `express`: ^5.1.0 - Web application framework
   - `express-rate-limit`: ^8.2.1 - Rate limiting middleware
   - `helmet`: ^8.1.0 - Security middleware
   - `mongoose`: ^8.19.3 - MongoDB object modeling
   - `nodemon`: ^3.1.11 - Development utility for auto-restarting

## Environment Setup

1. Copy the example environment file:
   ```bash
   cp example.env .env
   ```

2. Update the `.env` file with your actual values:
   ```
   PORT=your port number
   MONGO_URI=your MongoDb connection String
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   FRONTEND_URL=your frontend URL
   ```

   - `PORT`: Server port 
   - `MONGO_URI`: MongoDB connection string
   - `CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
   - `CLERK_SECRET_KEY`: Your Clerk secret key
   - `FRONTEND_URL`: Frontend application URL for CORS

## Running the Application

### Development Mode
```bash
npm run dev
```
Starts the server with nodemon for automatic restarts on file changes.

### Production Mode
```bash
npm start
```
Starts the server in production mode.

The server will run on the port specified in your `.env` file (default: 5000).

## API Endpoints

All API endpoints require authentication via Clerk middleware. Include the authorization header in your requests.

### Health Check
- `GET /health` - Check server and database status

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Staff
- `GET /api/staff` - Get all staff
- `GET /api/staff/:id` - Get staff by ID
- `POST /api/staff` - Create new staff
- `PUT /api/staff/:id` - Update staff
- `DELETE /api/staff/:id` - Delete staff

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create new course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Curriculums
- `GET /api/curriculums` - Get all curriculums
- `GET /api/curriculums/:id` - Get curriculum by ID
- `POST /api/curriculums` - Create new curriculum
- `PUT /api/curriculums/:id` - Update curriculum
- `DELETE /api/curriculums/:id` - Delete curriculum

### Classrooms
- `GET /api/classrooms` - Get all classrooms
- `GET /api/classrooms/:id` - Get classroom by ID
- `POST /api/classrooms` - Create new classroom
- `PUT /api/classrooms/:id` - Update classroom
- `DELETE /api/classrooms/:id` - Delete classroom

### Clubs
- `GET /api/clubs` - Get all clubs
- `GET /api/clubs/:id` - Get club by ID
- `POST /api/clubs` - Create new club
- `PUT /api/clubs/:id` - Update club
- `DELETE /api/clubs/:id` - Delete club

### Parents
- `GET /api/parents` - Get all parents
- `GET /api/parents/:id` - Get parent by ID
- `POST /api/parents` - Create new parent
- `PUT /api/parents/:id` - Update parent
- `DELETE /api/parents/:id` - Delete parent

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department by ID
- `POST /api/departments` - Create new department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Stakeholders
- `GET /api/stakeholders` - Get all stakeholders
- `GET /api/stakeholders/:id` - Get stakeholder by ID
- `POST /api/stakeholders` - Create new stakeholder
- `PUT /api/stakeholders/:id` - Update stakeholder
- `DELETE /api/stakeholders/:id` - Delete stakeholder

### Inventory
- `GET /api/inventory` - Get all inventory items
- `GET /api/inventory/:id` - Get inventory item by ID
- `POST /api/inventory` - Create new inventory item
- `PUT /api/inventory/:id` - Update inventory item
- `DELETE /api/inventory/:id` - Delete inventory item

## Project Structure

```
backend/
├── config/
│   └── db.js                 # Database connection configuration
├── src/
│   ├── controllers/          # Request handlers for each entity
│   │   ├── classroomController.js
│   │   ├── clubController.js
│   │   ├── courseController.js
│   │   ├── curriculumController.js
│   │   ├── departmentController.js
│   │   ├── inventoryController.js
│   │   ├── parentController.js
│   │   ├── staffController.js
│   │   ├── stakeholderController.js
│   │   └── studentController.js
│   ├── middleware/           # Custom middleware
│   │   ├── customAuth.js     # Authentication middleware
│   │   ├── errorHandler.js   # Error handling middleware
│   │   └── security.js       # Security middleware
│   ├── models/               # Mongoose schemas
│   │   ├── classroom.js
│   │   ├── club.js
│   │   ├── course.js
│   │   ├── curriculum.js
│   │   ├── department.js
│   │   ├── inventory.js
│   │   ├── parent.js
│   │   ├── staff.js
│   │   ├── stakeholder.js
│   │   └── student.js
│   └── routes/               # API route definitions
│       ├── classroomRoutes.js
│       ├── clubRoutes.js
│       ├── courseRoutes.js
│       ├── curriculumRoutes.js
│       ├── departmentRoutes.js
│       ├── inventoryRoutes.js
│       ├── parentRoutes.js
│       ├── staffRoutes.js
│       ├── stakeholderRoutes.js
│       └── studentRoutes.js
├── .env                      # Environment variables (create from example.env)
├── .gitignore                # Git ignore rules
├── example.env               # Environment variables template
├── package.json              # Project dependencies and scripts
├── package-lock.json         # Lockfile for dependencies
├── README.md                 # This file
└── server.js                 # Application entry point
```

## Data Models

Each entity has a comprehensive Mongoose schema with validation, timestamps, and appropriate data types. For example, the Student model includes fields for personal information, academic details, parent contacts, and enrollment status.

## Security Features

- **Authentication**: Clerk-based authentication for all protected routes
- **Rate Limiting**: Prevents abuse with configurable rate limits
- **Security Headers**: Helmet middleware for secure HTTP headers
- **CORS**: Configured for specific frontend origins
- **Input Validation**: Schema validation through Mongoose

## Error Handling

The application includes centralized error handling that provides consistent error responses across all endpoints.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

For support or questions, please contact the development team or create an issue in the repository.