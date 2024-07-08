import asyncHandler from "express-async-handler";
import User from "../Models/userModel.js";
import { config } from "dotenv";
import crypto from "crypto";
import pkg from "mailgun.js";
import formData from "form-data";

const Mailgun = pkg.default;

config();

const resetPassWord = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHashed = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save token to the user's record
    user.resetPasswordToken = resetTokenHashed;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();

    // Initialize Mailgun
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY,
    });

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    // Send reset email
    await mg.messages.create("sandbox81cd553fc6784d238c45c863b5bf9337.mailgun.org", {
      from: "diaombaye832@gmail.com",
      to: [user.email],
      subject: "Password Reset Request",
      text: `You requested a password reset. Please click on the link to reset your password: ${resetUrl}`,
      html: `<p>You requested a password reset. Please click on the link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
    });

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default resetPassWord;
