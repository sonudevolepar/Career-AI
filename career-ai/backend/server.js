require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Check environment variables
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in backend/.env");
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing in backend/.env");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in backend/.env");
    }

    console.log("Environment variables loaded successfully.");
    console.log("Gemini API key loaded:", 
      process.env.GEMINI_API_KEY.substring(0, 6) + "..."
    );

    // Connect MongoDB
    await connectDB();

    // Start server
    app.listen(PORT, () => {
      console.log("=================================");
      console.log(`Server is running on port ${PORT}`);
      console.log(`http://localhost:${PORT}`);
      console.log("=================================");
    });

  } catch (error) {
    console.error("=================================");
    console.error("Server failed to start:");
    console.error(error.message);
    console.error("=================================");
    process.exit(1);
  }
};

startServer();