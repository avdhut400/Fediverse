const jwt = require('jsonwebtoken');
const User = require('../models/User');

// const authMiddleware = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ error: 'No token provided' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id).select('_id username');

//     if (!user) {
//       return res.status(401).json({ error: 'User not found' });
//     }
//     console.log("DB Session:", user.activeSessionId);
//     console.log("JWT Session:", decoded.sessionId);
//     if (
//       !decoded.sessionId ||
//       !user.activeSessionId ||
//       user.activeSessionId !== decoded.sessionId
//     ) {
//       return res.status(401).json({
//         error: "Your account is logged in on another device.",
//         code: "SESSION_INVALID",
//       });
//     }

//     req.user = {
//       id: user._id.toString(),
//       username: user.username,
//       sessionId: decoded.sessionId,
//     };

//     next();

//     // Attach user to request
  
//   } catch (err) {
//     console.error(' Invalid token:', err.message);
//     res.status(401).json({ error: 'Invalid token' });
//   }
// };


const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('_id username');

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach user to request
    req.user = {
      id: user._id,
      username: user.username
    };

    next();
  } catch (err) {
    console.error('❌ Invalid token:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
