import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../Models/userModel.js';

const userProfile = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    try {
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
});

export default userProfile;
