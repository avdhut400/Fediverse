const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("Connected to DB");
//     app.listen(process.env.PORT, () => {
//       console.log("Server running on port", process.env.PORT);
//     });
//   })
//   .catch((err) => console.log(err));
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(" Connected to MongoDB");

    const PORT = process.env.PORT || 4000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" MongoDB Connection Error:", err);
  });