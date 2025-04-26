import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || "https://password-manager-1-3ne8.onrender.com", credentials: true }));
app.use(express.json());

// Enhanced MongoDB connection with improved options and error handling
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    
    await mongoose.connect(mongoURI, {
      dbName: process.env.DB_NAME,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
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
    
    // Exit with failure in production, or retry in development
    if (process.env.NODE_ENV === 'production') {
      console.error("Exiting due to database connection failure");
      process.exit(1);
    } else {
      console.log("Will retry connection in 5 seconds...");
      setTimeout(connectDB, 5000);
    }
  }
};

// Connect to MongoDB
connectDB();

// Add connection monitoring
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
  connectDB();
});

// Schema
const passwordSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  site: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
}, { timestamps: true });

const Password = mongoose.model("Password", passwordSchema);

// Middleware for error handling
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// GET all passwords
app.get("/", asyncHandler(async (req, res) => {
  const data = await Password.find();
  res.json(data);
}));

// POST new password
app.post("/", asyncHandler(async (req, res) => {
  const newEntry = new Password(req.body);
  await newEntry.save();
  res.status(201).json({ success: true, data: newEntry });
}));

// PUT to update password
app.put("/", asyncHandler(async (req, res) => {
  const { id, site, username, password } = req.body;
  
  if (!id) {
    return res.status(400).json({ success: false, message: "ID is required" });
  }
  
  const updatedPassword = await Password.findOneAndUpdate(
    { id }, 
    { site, username, password },
    { new: true, runValidators: true }
  );
  
  if (!updatedPassword) {
    return res.status(404).json({ success: false, message: "Password not found" });
  }
  
  res.json({ success: true, data: updatedPassword });
}));

// DELETE password
app.delete("/", asyncHandler(async (req, res) => {
  const { id } = req.body;
  
  if (!id) {
    return res.status(400).json({ success: false, message: "ID is required" });
  }
  
  const deletedPassword = await Password.findOneAndDelete({ id });
  
  if (!deletedPassword) {
    return res.status(404).json({ success: false, message: "Password not found" });
  }
  
  res.json({ success: true, data: deletedPassword });
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ 
    success: false, 
    message: process.env.NODE_ENV === 'production' 
      ? "Server error" 
      : err.message
  });
});

// Health check endpoint
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