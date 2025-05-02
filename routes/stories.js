const express = require("express");
const router = express.Router();
const Story = require("../models/Story");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

// Get all stories
router.get("/", async (req, res) => {
  try {
    const stories = await Story.find();
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single story by ID
router.get("/:id", async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Search stories
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q ? req.query.q.toString().toLowerCase() : "";
    const stories = await Story.find({
      status: "approved",
      $or: [
        { title: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new story (authenticated)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const story = new Story({
      ...req.body,
      user_name: req.user.username,
    });
    await story.save();
    res.status(201).json(story);
  } catch (error) {
    res.status(400).json({ message: "Invalid data" });
  }
});

// Update story status (authenticated, admin only)
router.patch("/:id", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
