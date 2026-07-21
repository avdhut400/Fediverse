
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Post = require("../models/Post"); 
const sendGreetingEmail=require("./mail");
const crypto = require("crypto");
const sendEmail=require("../config/sendEmail")



exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({
        error: "Username, password and email are required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Username or email already exists",
      });
    }

    const user = await User.create({
      username,
      password,
      email,
      actorUrl: `${process.env.BASE_URL}/users/${username}`,
      inbox: `${process.env.BASE_URL}/users/${username}/inbox`,
      outbox: `${process.env.BASE_URL}/users/${username}/outbox`,
    });

    const emailSent = await sendGreetingEmail(
      user.email,
      user.username
    );

    if (emailSent) {
      console.log("Welcome email sent");
    } else {
      console.log("Welcome email could not be sent");
    }

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      error: "Server error while registering user",
      details: error.message,
    });
  }
};






exports.login = async (req, res) => {
  const { username, password } = req.body;

  // console.log(" Login attempt:", username, password);

  const user = await User.findOne({ username }).select("+password +privateKey");
  // console.log(" Found user from DB:", user);

  if (!user || !user.password) {
    // console.log(" User not found or password missing");
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isMatch = await user.comparePassword(password);
  // console.log(" Password match result:", isMatch);

  if (!isMatch) {
    // console.log(" Password did not match");
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({
    id: user._id,
    username: user.username,
    actor: `${process.env.BASE_URL}/users/${user.username}`, 
  }, process.env.JWT_SECRET, { expiresIn: "7d" });
  // console.log(" Token created:", token);

  const userData = user.toObject();
  delete userData.password;
  delete userData.privateKey;

  return res.json({ token, user: userData });
};



exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Authorization check (for local or remote)
    if (
      post.author?.toString() !== req.user.id &&
      post.actor !== req.user.actor
    ) {
      return res.status(403).json({ error: "Not authorized to delete this post" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
};












exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: "If this email exists, a reset link has been sent",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = hashedResetToken;
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:3000";

    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const message = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Password Reset</title>
    </head>

    <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">

      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        style="padding:40px 0;"
      >
        <tr>
          <td align="center">

            <table
              width="600"
              cellpadding="0"
              cellspacing="0"
              style="
                background:#ffffff;
                border-radius:12px;
                overflow:hidden;
                box-shadow:0 5px 15px rgba(0,0,0,.08);
              "
            >

              <tr>
                <td
                  align="center"
                  style="
                    background:#0f172a;
                    padding:30px;
                    color:white;
                    font-size:28px;
                    font-weight:bold;
                  "
                >
                  PhotoFlux
                </td>
              </tr>

              <tr>
                <td style="padding:40px;color:#333;line-height:1.8;">

                  <h2 style="margin-top:0;">
                    Reset Your Password
                  </h2>

                  <p>
                    Hello <strong>${user.username}</strong>,
                  </p>

                  <p>
                    We received a request to reset your password.
                    Click the button below to create a new password.
                  </p>

                  <div style="text-align:center;margin:35px 0;">
                    <a
                      href="${resetUrl}"
                      style="
                        background:#2563eb;
                        color:#ffffff;
                        text-decoration:none;
                        padding:14px 32px;
                        border-radius:8px;
                        display:inline-block;
                        font-size:16px;
                        font-weight:bold;
                      "
                    >
                      Reset Password
                    </a>
                  </div>

                  <p>
                    This link will expire in
                    <strong>15 minutes</strong>.
                  </p>

                  <p>
                    If you did not request a password reset,
                    you can safely ignore this email.
                    Your password will remain unchanged.
                  </p>

                  <hr
                    style="
                      border:none;
                      border-top:1px solid #e5e7eb;
                      margin:35px 0;
                    "
                  />

                  <p style="font-size:13px;color:#666;">
                    If the button does not work, copy and paste
                    this link into your browser:
                  </p>

                  <p
                    style="
                      word-break:break-all;
                      font-size:13px;
                      color:#2563eb;
                    "
                  >
                    ${resetUrl}
                  </p>

                </td>
              </tr>

              <tr>
                <td
                  align="center"
                  style="
                    background:#f8fafc;
                    padding:20px;
                    font-size:13px;
                    color:#777;
                  "
                >
                  © ${new Date().getFullYear()} PhotoFlux.
                  All rights reserved.
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
  `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: message,
      });

      return res.status(200).json({
        message: "Password reset link sent to your email",
      });
    } catch (emailError) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      await user.save({ validateBeforeSave: false });

      console.error("Reset email error:", emailError);

      return res.status(500).json({
        error: "Unable to send password reset email",
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      error: "Server error",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({
        error: "Password and confirm password are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "Passwords do not match",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    const hashedResetToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedResetToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        error: "Reset token is invalid or expired",
      });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful. You can now login.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      error: "Server error",
    });
  }
};