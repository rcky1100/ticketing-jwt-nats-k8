import mongoose from "mongoose";

import { app } from "./app";
import { connectMongo } from "./connect-mongo";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  // Start HTTP server first.
  // This allows Kubernetes to access health endpoints
  // even when dependencies are unavailable.

  const server = app.listen(3000, () => {
    console.log("Listening on port 3000");
  });

  // Connect MongoDB with retry
  connectMongo();

  // Graceful shutdown
  const shutdown = async () => {
    console.log("Shutting down application");
    server.close();
    try {
      await mongoose.connection.close();
    } catch (error) {
      console.error("Error during shutdown:", error);
    }
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

start();
