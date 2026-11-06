import express from "express";

import { natsWrapper } from "./nats-wrapper";

const healthApp = express();

let listenerReady = false;

// Liveness: Is the application alive?
healthApp.get("/api/expiration/health/live", (req, res) => {
  return res.status(200).send({
    status: "OK",
  });
});

// Readiness: Is the worker ready to process events?
healthApp.get("/api/expiration/health/ready", (req, res) => {
  const natsConnected = natsWrapper.isConnected;

  const isReady = natsConnected && listenerReady;

  return res.status(isReady ? 200 : 503).send({
    status: isReady ? "READY" : "NOT READY",
    dependencies: {
      nats: natsConnected ? "CONNECTED" : "DISCONNECTED",
      listener: listenerReady ? "READY" : "NOT READY",
    },
  });
});

export const setListenerReady = (ready: boolean) => {
  listenerReady = ready;
};

export const startHealthServer = () => {
  return healthApp.listen(3004, () => {
    console.log("Health server listening on port 3004");
  });
};
