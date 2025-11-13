// backend/src/middleware/customAuth.js
const { clerkClient } = require('@clerk/clerk-sdk-node');

const customAuth = async (req, res, next) => {
  try {
    console.log('🔐 Custom Auth - Checking authentication...');
    
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No Bearer token found');
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No authentication token provided'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      console.log('❌ Empty token');
      return res.status(401).json({
        error: 'Unauthorized', 
        message: 'Invalid token format'
      });
    }

    console.log('🔐 Token found, verifying with Clerk...');

    try {
      // Verify the token using Clerk
      const decoded = await clerkClient.verifyToken(token);
      console.log('✅ Token verified successfully for user:', decoded.sub);
      
      // Attach the decoded token to req.auth
      req.auth = {
        userId: decoded.sub,
        sessionId: decoded.sid,
        ...decoded
      };
      
      next();
    } catch (error) {
      console.log('❌ Token verification failed:', error.message);
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
    }
  } catch (error) {
    console.error('🔥 Auth middleware error:', error);
    return res.status(500).json({
      error: 'Authentication error',
      message: 'Internal server error during authentication'
    });
  }
};

module.exports = customAuth;