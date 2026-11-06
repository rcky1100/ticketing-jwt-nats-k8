import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { connectMongo } from "./connect-mongo";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }

  // Start HTTP server first.
  // This allows Kubernetes to access health endpoints
  // even when dependencies are unavailable.

  const server = app.listen(3001, () => {
    console.log("Listening on port 3001");
  });

  // Connect MongoDB with retry
  connectMongo();

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL,
    );

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();
  } catch (err) {
    console.error("NATS connection failed:", err);
  }

  // Graceful shutdown
  const shutdown = async () => {
    console.log("Shutting down application");

    server.close();

    try {
      if (natsWrapper.isConnected) {
        natsWrapper.client.close();
      }

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
