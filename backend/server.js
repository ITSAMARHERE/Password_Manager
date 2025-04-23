import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  dbName: process.env.DB_NAME,
  poolSize: 10, // Increase the pool size if necessary
  serverSelectionTimeoutMS: 5000, 
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("Mongo error", err));


// Schema
const passwordSchema = new mongoose.Schema({
    id: String,
    site: String,
    username: String,
    password: String,
});
passwordSchema.index({ id: 1 });
const Password = mongoose.model("Password", passwordSchema);

// GET all passwords
app.get("/", async (req, res) => {
    const data = await Password.find();
    res.json(data);
});

// POST new password
app.post("/", async (req, res) => {
    const newEntry = new Password(req.body);
    await newEntry.save();
    res.json({ success: true });
});

// PUT to update password
app.put("/", async (req, res) => {
    const { id, site, username, password } = req.body;
    await Password.findOneAndUpdate({ id }, { site, username, password });
    res.json({ success: true });
});

// DELETE password
app.delete("/", async (req, res) => {
    const { id } = req.body;
    await Password.findOneAndDelete({ id });
    res.json({ success: true });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port", process.env.PORT);
});
