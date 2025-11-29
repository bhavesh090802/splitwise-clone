const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    // Expect header: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2) return res.status(401).json({ message: 'Invalid token format' });

    const token = parts[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id; // attach user id to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
}

module.exports = authMiddleware;
