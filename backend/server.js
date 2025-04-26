import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  'https://password-manager-1-3ne8.onrender.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('The CORS policy for this site does not allow access from the specified origin.'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    
    await mongoose.connect(mongoURI, {
      dbName: process.env.DB_NAME,
      serverSelectionTimeoutMS: 30000, 
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 30000,
    });
    
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", {
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    
    if (process.env.NODE_ENV === 'production') {
      console.error("Exiting due to database connection failure");
      process.exit(1);
    } else {
      console.log("Will retry connection in 5 seconds...");
      setTimeout(connectDB, 5000);
    }
  }
};


connectDB();


mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
  connectDB();
});


const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true }
}, { timestamps: true });


const passwordSchema = new mongoose.Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true }, 
  site: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
}, { timestamps: true });


passwordSchema.index({ id: 1, userId: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);
const Password = mongoose.model("Password", passwordSchema);


const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);


const authenticate = asyncHandler(async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
});


app.post("/api/register", asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }
  

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: "User already exists with this email" });
  }
 
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  

  const user = new User({
    name,
    email,
    password: hashedPassword
  });
  
  await user.save();
  

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET || "your_jwt_secret_key",
    { expiresIn: '7d' }
  );
  
  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
}));


app.post("/api/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }
 
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ success: false, message: "Invalid credentials" });
  }
  

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: "Invalid credentials" });
  }
  

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET || "your_jwt_secret_key",
    { expiresIn: '7d' }
  );
  
  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
}));


app.get("/api/profile", authenticate, asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  
  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
}));


app.get("/api/passwords", authenticate, asyncHandler(async (req, res) => {
  const data = await Password.find({ userId: req.userId });
  res.json(data);
}));


app.post("/api/passwords", authenticate, asyncHandler(async (req, res) => {
  const newEntry = new Password({
    ...req.body,
    userId: req.userId
  });
  
  await newEntry.save();
  res.status(201).json({ success: true, data: newEntry });
}));


app.put("/api/passwords", authenticate, asyncHandler(async (req, res) => {
  const { id, site, username, password } = req.body;
  
  if (!id) {
    return res.status(400).json({ success: false, message: "ID is required" });
  }
  
  const updatedPassword = await Password.findOneAndUpdate(
    { id, userId: req.userId }, 
    { site, username, password },
    { new: true, runValidators: true }
  );
  
  if (!updatedPassword) {
    return res.status(404).json({ success: false, message: "Password not found" });
  }
  
  res.json({ success: true, data: updatedPassword });
}));


app.delete("/api/passwords", authenticate, asyncHandler(async (req, res) => {
  const { id } = req.body;
  
  if (!id) {
    return res.status(400).json({ success: false, message: "ID is required" });
  }
  
  const deletedPassword = await Password.findOneAndDelete({ id, userId: req.userId });
  
  if (!deletedPassword) {
    return res.status(404).json({ success: false, message: "Password not found" });
  }
  
  res.json({ success: true, data: deletedPassword });
}));

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ 
    success: false, 
    message: process.env.NODE_ENV === 'production' 
      ? "Server error" 
      : err.message
  });
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    dbConnected: mongoose.connection.readyState === 1,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});