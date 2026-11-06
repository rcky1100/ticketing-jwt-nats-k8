import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Liveness probe
router.get("/api/users/health/live", (req, res) => {
  res.status(200).send({
    status: "OK",
  });
});

// Readiness probe
router.get("/api/users/health/ready", (req, res) => {
  const mongoConnected = mongoose.connection.readyState === 1;

  const isReady = mongoConnected;

  res.status(isReady ? 200 : 503).send({
    status: isReady ? "READY" : "NOT READY",
    dependencies: {
      mongodb: mongoConnected ? "CONNECTED" : "DISCONNECTED"
    },
  });
});

export { router as healthRouter };
