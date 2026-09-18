require("dotenv").config();

const fetch = require("node-fetch");
const express = require('express');
const cors = require('cors');
const app = express();
// app.use(cors({
//   origin: "http://localhost:3000" || process.env.FRONTEND_URL,
//   credentials: true // optional: if using cookies
// }));

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);



// app.use(cors({
//   origin: process.env.FRONTEND_URL || "http://localhost:3000",
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true
// }));
// app.use(
//   cors({
//     origin:
//       process.env.FRONTEND_URL ||
//       "http://localhost:3000",
//     methods: [
//       "GET",
//       "POST",
//       "PUT",
//       "PATCH",
//       "DELETE",
//       "OPTIONS",
//     ],
//     allowedHeaders: [
//       "Content-Type",
//       "Authorization",
//       "Accept",
//       "ngrok-skip-browser-warning",
//     ],
//     credentials: true,
//   })
// );


// const allowedOrigins = [
//   "http://localhost:3000",
//   "https://fediverse-rho.vercel.app",
// ];

// const corsOptions = {
//   origin: (origin, callback) => {
//     // Postman/server-to-server requests मध्ये origin नसतो
//     if (!origin) {
//       return callback(null, true);
//     }

//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }

//     console.log("Blocked CORS origin:", origin);
//     return callback(new Error("Not allowed by CORS"));
//   },

//   methods: [
//     "GET",
//     "POST",
//     "PUT",
//     "PATCH",
//     "DELETE",
//     "OPTIONS",
//   ],

//   allowedHeaders: [
//     "Content-Type",
//     "Authorization",
//     "Accept",
//     "ngrok-skip-browser-warning",
//   ],

//   credentials: true,
//   optionsSuccessStatus: 204,
// };


// const replyRoutes = require("./routes/replyRoutes");

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const activityPubRoutes = require('./routes/activityPubRoutes');
const feedRoutes = require("./routes/feedRoutes");
const followRoutes = require("./routes/followRoutes");
// const auth=require("./routes/auth");
const commentRoutes = require('./routes/comments');
const chatbotRoutes = require('./routes/chat');


// const { resolveRemoteActor } = require("./controllers/activityPubController");



app.use(express.json({ type: ['application/json', 'application/activity+json'] }));

app.use(express.urlencoded({ extended: true }));
// app.use(express.json());


// app.put("/api/users/me/profile-picture", (req, res) => {
//   return res.status(200).json({
//     message: "Profile picture route is working",
//   });
// });



// app.use("/replies", replyRoutes);
app.use('/api/posts', commentRoutes);





// app.get("/remote/resolve", resolveRemoteActor);





app.use("/api", chatbotRoutes);


app.use("/follow", followRoutes);
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", feedRoutes);
app.use("/.well-known", activityPubRoutes); // Webfinger

app.use("/users", activityPubRoutes);
// app.use("/api/auth", auth);
// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
