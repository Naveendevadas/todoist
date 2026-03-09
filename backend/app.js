const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;
const mongoConnect = require('./db/config');
const userRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todoRoutes');


dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:3000",  // ⭐ MUST be exact frontend URL
  credentials: true                // ⭐ VERY IMPORTANT
}));

app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);


mongoConnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB");
  });
