const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Story = require("./models/Story");
const User = require("./models/User");

const dummyStories = [
  {
    title: "Kenya Unveils New Tech Hub in Nairobi",
    body: "The government has launched a state-of-the-art tech hub to boost innovation.",
    category: "Tech",
    tags: ["innovation", "tech"],
    media_url: "https://via.placeholder.com/600x400?text=Tech+Hub",
    user_name: "user1",
    created_at: new Date("2025-04-28"),
    status: "approved",
  },
  {
    title: "Election Campaigns Gain Momentum",
    body: "Political parties are intensifying campaigns ahead of the elections.",
    category: "Politics",
    tags: ["elections", "politics"],
    media_url: "https://via.placeholder.com/600x400?text=Elections",
    user_name: "user2",
    created_at: new Date("2025-04-27"),
    status: "pending",
  },
  {
    title: "Historic Win for Kenya’s Athletics Team",
    body: "Kenya’s athletes dominated the international marathon.",
    category: "Sports",
    tags: ["athletics", "sports"],
    media_url: "https://via.placeholder.com/600x400?text=Athletics",
    user_name: "user1",
    created_at: new Date("2025-04-26"),
    status: "approved",
  },
];

const dummyUsers = [
  { username: "user1", password: "password123", role: "user" },
  { username: "user2", password: "password456", role: "user" },
  { username: "admin", password: "admin123", role: "admin" },
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Story.deleteMany();
    await User.deleteMany();

    // Insert dummy data
    await Story.insertMany(dummyStories);
    await User.insertMany(dummyUsers);

    console.log("Data seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
