require("dotenv").config();

const fetch = require("node-fetch");
const express = require("express");
const cors = require("cors");
const passport = require("passport"); // ✅ ADD

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(passport.initialize()); // ✅ ADD
require("./auth/google");       // ✅ ADD 

const replyRoutes = require("./routes/replyRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const activityPubRoutes = require("./routes/activityPubRoutes");
const feedRoutes = require("./routes/feedRoutes");
const followRoutes = require("./routes/followRoutes");
const commentRoutes = require("./routes/comments");

app.use(express.json({ type: ['application/json', 'application/activity+json'] }));
app.use(express.urlencoded({ extended: true }));

app.use("/replies", replyRoutes);
app.use("/api/posts", commentRoutes);
app.use("/follow", followRoutes);


app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", feedRoutes);
app.use("/.well-known", activityPubRoutes);
app.use("/users", activityPubRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
