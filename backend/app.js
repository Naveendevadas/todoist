const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;
const mongoConnect = require('./db/config');
const userRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todoRoutes');
dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin:process.env.FRONTEND_URI , 
  credentials: true                
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
