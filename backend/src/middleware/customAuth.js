// backend/src/middleware/customAuth.js
const { createClerkClient } = require('@clerk/clerk-sdk-node');

console.log('🔐 Custom Auth Middleware loaded');
console.log('🔐 Secret Key exists:', !!process.env.CLERK_SECRET_KEY);
console.log('🔐 JWT Key exists:', !!process.env.CLERK_JWT_KEY);

// Process the JWT key - replace \n with actual newlines if needed
const processJwtKey = (jwtKey) => {
  if (!jwtKey) return undefined;
  
  // If key contains \n, replace with actual newlines
  if (jwtKey.includes('\\n')) {
    console.log('🔄 Processing JWT key: replacing \\n with actual newlines');
    return jwtKey.replace(/\\n/g, '\n');
  }
  
  return jwtKey;
};

const clerkOptions = {
  secretKey: process.env.CLERK_SECRET_KEY,
  jwtKey: processJwtKey(process.env.CLERK_JWT_KEY),
};

console.log('🔐 JWT Key processed successfully:', !!clerkOptions.jwtKey);

const clerk = createClerkClient(clerkOptions);

const customAuth = async (req, res, next) => {
  try {
    console.log('🔐 Custom Auth - Checking authentication...');
    
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No Bearer token found in headers');
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No authentication token provided',
        code: 'MISSING_TOKEN'
      });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    
    if (!token) {
      console.log('❌ Empty token after extraction');
      return res.status(401).json({
        error: 'Unauthorized', 
        message: 'Invalid token format',
        code: 'INVALID_TOKEN_FORMAT'
      });
    }

    console.log('🔐 Token found, verifying with Clerk...');
    console.log('🔐 Token preview:', token.substring(0, 20) + '...');

    try {
      const decoded = await clerk.verifyToken(token);
      console.log('✅ Token verified successfully for user:', decoded.sub);
      console.log('✅ Session ID:', decoded.sid);
      console.log('✅ Token issued:', new Date(decoded.iat * 1000).toISOString());
      console.log('✅ Token expires:', new Date(decoded.exp * 1000).toISOString());
      
      req.auth = {
        userId: decoded.sub,
        sessionId: decoded.sid,
        issuer: decoded.iss,
        issuedAt: new Date(decoded.iat * 1000),
        expiresAt: new Date(decoded.exp * 1000),
        ...decoded
      };
      
      console.log('✅ Authentication successful, proceeding to route...');
      next();
    } catch (verificationError) {
      console.log('❌ Token verification failed:', verificationError.message);
      console.log('🔍 Error reason:', verificationError.reason);
      
      if (verificationError.reason === 'jwk-failed-to-resolve') {
        console.log('💡 Check that CLERK_JWT_KEY is properly formatted in .env');
        console.log('💡 Make sure newlines are represented as \\n');
      }
      
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
        code: 'TOKEN_VERIFICATION_FAILED',
        details: verificationError.message
      });
    }
  } catch (error) {
    console.error('🔥 Auth middleware unexpected error:', error);
    return res.status(500).json({
      error: 'Authentication Error',
      message: 'Internal server error during authentication',
      code: 'AUTH_INTERNAL_ERROR'
    });
  }
};

module.exports = customAuth;