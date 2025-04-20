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






// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const path = require("path");
// const dotenv = require("dotenv");
// // const User = require('./models/User');
// const userRoutes = require('./routes/userRoutes');
// const flowerRoutes = require('./routes/flowerRoutes');
// const translateText = require("./utils/translate");
// const jwt = require('jsonwebtoken');
// const cartRoutes = require("./routes/CartRoutes");
// const wishlistRoutes = require("./routes/wishlistRoutes1");
// dotenv.config();
// const app = express();

// // Middleware
// app.use(express.json());
// // const cors = require("cors");

// // Allow requests from your React app
// app.use(cors({
//   origin: "http://localhost:3000", // frontend origin
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));
// app.options('*', cors());

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/blossom', userRoutes);
// app.use("/api/cart", cartRoutes);
// // Connect to MongoDB using environment variables
// const userDB = mongoose.createConnection(process.env.USER_DB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// const User = require('./models/User')(userDB);

// const flowerDB = mongoose.createConnection(process.env.FLOWER_DB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// const wishlistDB = mongoose.createConnection(process.env.WISHLIST_DB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// userDB.on('connected', () => console.log('Connected to userDetails database'));
// flowerDB.on('connected', () => console.log('Connected to blossom database'));
// wishlistDB.on("connected", () => console.log("Connected to wishlist database"));

// // Provide flowerDB to your flowerRoutes
// app.use('/api/flower', (req, res, next) => {
//   req.flowerDB = flowerDB;
//   next();
// }, flowerRoutes);
// app.use("/api/wishlist", (req, res, next) => {
//   req.wishlistDB = wishlistDB;
//   req.flowerDB = flowerDB;
//   next();
// }, wishlistRoutes);




// app.post("/api/signup", async (req, res) => {
//   const { name, email, password, role } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already registered." });
//     }

//     const user = new User({ name, email, password, role });
//     await user.save();
//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });
//     res.status(201).json({ message: "Signup successful!" });
//   } catch (error) {
//     console.error("Signup error:", error); // log full error in console
//     res.status(500).json({
//       message: "Error creating user.",
//       error: error.message || error.toString(),
//     });
//   }
// });

// app.post("/api/translate", async (req, res) => {
//   try {
//     const { text, targetLang } = req.body;
//     if (!text) return res.status(400).json({ message: "Text is required" });

//     const translatedText = await translateText(text, targetLang || "en");
//     res.json({ translatedText });
//   } catch (error) {
//     console.error("Translation API Error:", error);
//     res.status(500).json({ message: "Translation failed" });
//   }
// });


// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });




const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const userRoutes = require('./routes/userRoutes');
const flowerRoutes = require('./routes/flowerRoutes');
const translateText = require("./utils/translate");
const jwt = require('jsonwebtoken');
const cartRoutes = require("./routes/CartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes1");
const wishlistDB = mongoose.createConnection(process.env.WISHLIST_DB_URI, { /* config */ });

const Wishlist = require('./models/wishlist')(wishlistDB);

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Allow requests from your React app
app.use(cors({
  origin: "http://localhost:3000", // frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.options('*', cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/blossom', userRoutes);
// app.use("/api/cart", cartRoutes);

// Connect to MongoDB using environment variables
const userDB = mongoose.createConnection(process.env.USER_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const User = require('./models/User')(userDB);

const flowerDB = mongoose.createConnection(process.env.FLOWER_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000
});



userDB.on('connected', () => console.log('Connected to userDetails database'));
flowerDB.on('connected', () => console.log('Connected to blossom database'));
wishlistDB.on("connected", () => console.log("Connected to wishlist database"));
const Flower = require('./models/Flower')(flowerDB);

// Provide flowerDB to your flowerRoutes
app.use('/api/flower', (req, res, next) => {
  req.flowerDB = flowerDB;
  next();
}, flowerRoutes);

app.use("/api/wishlist", (req, res, next) => {
  req.Wishlist = wishlistDB.model("Wishlist");
  req.flowerDB = flowerDB.model("Flower"); // Pass the flowerDB connection
  next();
}, wishlistRoutes);


// Connection for cart database
const cartDB = mongoose.createConnection(process.env.CART_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Cart = require('./models/Cart')(cartDB);

cartDB.on('connected', () => console.log('Connected to cart database'));

// Inject into route
app.use("/api/cart", (req, res, next) => {
  req.Cart = cartDB.model("Cart");
  req.flowerDB = flowerDB.model("Flower"); // Ensure flowerDB is correctly initialized and passed
  next();
}, require("./routes/CartRoutes"));


app.post("/api/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const user = new User({ name, email, password, role });
    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(201).json({ message: "Signup successful!" });
  } catch (error) {
    console.error("Signup error:", error); // log full error in console
    res.status(500).json({
      message: "Error creating user.",
      error: error.message || error.toString(),
    });
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
