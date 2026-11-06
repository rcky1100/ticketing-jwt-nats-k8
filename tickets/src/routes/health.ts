import express from "express";
import mongoose from "mongoose";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

// Liveness probe
router.get("/api/tickets/health/live", (req, res) => {
  res.status(200).send({
    status: "OK",
  });
});

// Readiness probe
router.get("/api/tickets/health/ready", (req, res) => {
  const mongoConnected = mongoose.connection.readyState === 1;
  const natsConnected = natsWrapper.isConnected;

  const isReady = mongoConnected && natsConnected;

  res.status(isReady ? 200 : 503).send({
    status: isReady ? "READY" : "NOT READY",
    dependencies: {
      mongodb: mongoConnected ? "CONNECTED" : "DISCONNECTED",
      nats: natsConnected ? "CONNECTED" : "DISCONNECTED",
    },
  });
});

export { router as healthRouter };
