import asyncHandler from "express-async-handler";
import User from "../Models/userModel.js";
import ResetToken from "../Models/resetToken.js";
import { config } from "dotenv";
import crypto from "crypto";
import nodemailer from "nodemailer";
config();

const resetPassWord = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Store the token in ResetToken model
    const resetTokenDoc = new ResetToken({
      email: user.email,
      token: resetToken,
    });
    await resetTokenDoc.save();

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: {
        name: "ShopFast",
        address: process.env.EMAIL,
      },
      to: [user.email],
      subject: "Password Reset Request",
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
        `http://localhost:3000/auth/reset-password/${resetToken}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions);
    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: "Server error" });
  }
});

export default resetPassWord;
