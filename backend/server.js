// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error(err));

// app.get('/', (req, res) => {
//   res.send('Backend is running!');
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });// Import dependencies




// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const path = require("path");
// const flowerRoutes = require('./routes/flowerRoutes');

// // Initialize express app
// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded images

// // Connect to MongoDB
// mongoose.connect("mongodb://localhost:27017/userDetails")
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Failed to connect to MongoDB:", err));

// // Define user schema and model
// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, unique: true, required: true },
//   password: { type: String, required: true },
// });

// const User = mongoose.model("User", userSchema);

// // API Routes
// app.use('/api/flowers', flowerRoutes);

// // Signup API
// app.post("/api/signup", async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already registered." });
//     }
//     const user = new User({ name, email, password });
//     await user.save();
//     res.status(201).json({ message: "Signup successful!" });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating user.", error });
//   }
// });

// // Login API
// app.post("/api/blossom/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user || user.password !== password) {
//       return res.status(400).json({ message: "Invalid email or password." });
//     }
//     res.status(200).json({ message: "Login successful!" });
//   } catch (error) {
//     res.status(500).json({ message: "Error logging in.", error });
//   }
// });

// // Start server
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


// Configure Multer for Image Uploading
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
// const User = require('./models/User');
const userRoutes = require('./routes/userRoutes');
const flowerRoutes = require('./routes/flowerRoutes');
const translateText = require("./utils/translate");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB using environment variables
const userDB = mongoose.createConnection(process.env.USER_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const User = require('./models/User')(userDB);

const flowerDB = mongoose.createConnection(process.env.FLOWER_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

userDB.on('connected', () => console.log('Connected to userDetails database'));
flowerDB.on('connected', () => console.log('Connected to blossom database'));

// Provide flowerDB to your flowerRoutes
app.use('/api/flowers', (req, res, next) => {
  req.flowerDB = flowerDB;
  next();
}, flowerRoutes);

// User routes
app.use('/api/users', (req, res, next) => {
  req.userDB = userDB;
  next();
}, userRoutes);

// Login API
// app.post("/api/blossom/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user || user.password !== password) {
//       return res.status(400).json({ message: "Invalid email or password." });
//     }
//     res.status(200).json({ message: "Login successful!" });
//   } catch (error) {
//     res.status(500).json({ message: "Error logging in.", error });
//   }
// });

const bcrypt = require('bcrypt');

app.post("/api/blossom/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // ✅ Compare the entered password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    res.status(200).json({ message: "Login successful!" });

  } catch (error) {
    res.status(500).json({ message: "Error logging in.", error });
  }
});


// // Signup API
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: "Signup successful!" });
  } catch (error) {
    console.error("Signup Errorr:", error); // Log to server
    res.status(500).json({ message: "Error creating user.", error: error.message });
  }
});

app.post("/api/translate", async (req, res) => {
  try {
    const { text, targetLang } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });

    const translatedText = await translateText(text, targetLang || "en");
    res.json({ translatedText });
  } catch (error) {
    console.error("Translation API Error:", error);
    res.status(500).json({ message: "Translation failed" });
  }
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
