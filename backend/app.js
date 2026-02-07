require("dotenv").config();

const fetch = require("node-fetch");
const express = require('express');
const cors = require('cors');
const app = express();

// Issue #10: Use environment variable for CORS origin instead of hardcoded value
app.use(cors({
  origin: (process.env.CLIENT_URL || "http://localhost:3000").split(',').map(o => o.trim()).filter(Boolean),
  credentials: true // optional: if using cookies
}));




const replyRoutes = require("./routes/replyRoutes");
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const activityPubRoutes = require('./routes/activityPubRoutes');
const feedRoutes = require("./routes/feedRoutes");
const followRoutes = require("./routes/followRoutes");
// Issue #9: Removed duplicate auth import - consolidated into authRoutes
const commentRoutes = require('./routes/comments');


app.use(express.json({ type: ['application/json', 'application/activity+json'] }));

app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// Health check endpoint for testing (Issue #13)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});


app.use("/replies", replyRoutes);
app.use('/api/posts', commentRoutes);


app.use("/follow", followRoutes);
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", feedRoutes);
app.use("/.well-known", activityPubRoutes); // Webfinger

app.use("/users", activityPubRoutes);
// Issue #9: Removed duplicate auth route mount (was: app.use("/api/auth", auth))
// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
