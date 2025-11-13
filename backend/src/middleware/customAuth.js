// // Add this to your server.js or create a new middleware file
// const customAuth = (req, res, next) => {
//   // Check if user is authenticated via Clerk
//   if (req.auth && req.auth.userId) {
//     // User is authenticated, proceed to the route
//     return next();
//   } else {
//     // User is not authenticated, send proper 401
//     return res.status(401).json({ 
//       error: 'Unauthorized',
//       message: 'Authentication required' 
//     });
//   }
// };

// module.exports = customAuth;

// backend/src/middleware/customAuth.js - Development version
const customAuth = (req, res, next) => {
  console.log('🔐 Custom Auth - DEVELOPMENT MODE: Allowing all requests');
  next(); // Allow all requests during development
  
  // For production, you'll replace this with real auth logic
};

module.exports = customAuth;