import asyncHandler from 'express-async-handler'
import ResetToken from '../Models/resetToken.js';
import User from '../Models/userModel.js';
import bcrypt from "bcryptjs";


const verifyResetToken = asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    try {
      const resetTokenDoc = await ResetToken.findOne({ token });
  
      if (!resetTokenDoc) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }
  
      const user = await User.findOne({ email: resetTokenDoc.email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();
  
      // Delete the token after successful password reset
      await ResetToken.deleteOne({ token });
  
      res.json({ message: "Password reset successful" });
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  export default verifyResetToken;
  