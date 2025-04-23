import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));
app.use(express.json());

// Helper to create detailed connection error logs
const logConnectionError = (err) => {
  console.error("❌ MongoDB connection error:", {
    message: err.message,
    code: err.code,
    name: err.name,
    stack: err.stack?.split('\n').slice(0, 3).join('\n') // Abbreviated stack for readability
  });
  
  if (err.message.includes("IP that isn't whitelisted")) {
    console.error(`
    ======================================================
    🚨 IP WHITELIST ERROR DETECTED 🚨
    
    Your Render server IP is not whitelisted in MongoDB Atlas.
    
    Solutions:
    1) Go to MongoDB Atlas -> Network Access -> Add IP Address
       Add entry: 0.0.0.0/0 (allow access from anywhere)
       
    2) Or add specific Render IPs (check Render docs)
    
    3) Or use MongoDB Atlas serverless instances
    ======================================================
    `);
  }
};

// Enhanced MongoDB connection with better error handling
const connectDB = async (retryCount = 0) => {
  try {
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    
    console.log("Attempting to connect to MongoDB...");
    
    // Add retry parameters if they're not already in the URI
    const connectionString = mongoURI.includes('?') 
      ? mongoURI 
      : `${mongoURI}?retryWrites=true&w=majority`;
    
    await mongoose.connect(connectionString, {
      dbName: process.env.DB_NAME,
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    
    console.log("✅ MongoDB connected successfully");
    
    // Reset retry count on successful connection
    if (retryCount > 0) {
      console.log(`Successfully connected after ${retryCount} retries`);
    }
    
  } catch (err) {
    logConnectionError(err);
    
    const maxRetries = 5;
    if (retryCount < maxRetries && process.env.NODE_ENV !== 'production') {
      const delay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff
      console.log(`Retrying connection (${retryCount + 1}/${maxRetries}) in ${delay/1000} seconds...`);
      setTimeout(() => connectDB(retryCount + 1), delay);
    } else {
      if (process.env.NODE_ENV === 'production') {
        console.error("Failed to connect to database in production mode");
        // In production we continue running but with database in failed state
        // This allows the app to at least serve a "maintenance mode" page
      } else {
        console.error(`Failed to connect after ${maxRetries} retries`);
      }
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
  setTimeout(connectDB, 5000); // Wait 5 seconds before trying to reconnect
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

// Health check endpoint that always works even if DB is down
app.get("/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
    99: "uninitialized"
  }[dbStatus] || "unknown";
  
  res.json({ 
    status: "service running", 
    database: {
      status: dbStatusText,
      readyState: dbStatus
    },
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// DB connection check middleware for database routes
const dbConnected = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Database connection unavailable. Please try again later.",
      details: process.env.NODE_ENV === 'production' ? {} : {
        readyState: mongoose.connection.readyState
      }
    });
  }
  next();
};

// Apply database middleware to all database operations
app.use(["/", "/passwords"], dbConnected);

// GET all passwords
app.get("/", asyncHandler(async (req, res) => {
  const data = await Password.find();
  res.json({ success: true, data });
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
  
  // Handle specific MongoDB errors
  if (err.name === 'MongoNetworkError' || err.name === 'MongooseServerSelectionError') {
    return res.status(503).json({
      success: false,
      message: "Database connection error. Please try again later."
    });
  }
  
  res.status(500).json({ 
    success: false, 
    message: process.env.NODE_ENV === 'production' 
      ? "Server error" 
      : err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});