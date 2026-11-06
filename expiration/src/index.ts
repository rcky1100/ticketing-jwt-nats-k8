import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { startHealthServer, setListenerReady } from "./health-server";

const start = async () => {
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }

  // Start health server before connecting to NATS
  const healthServer = startHealthServer();

  let isShuttingDown = false;

  const shutdown = () => {
    if (isShuttingDown) return;

    isShuttingDown = true;
    setListenerReady(false);

    console.log("Shutting down expiration service");

    healthServer.close(() => {
      if (natsWrapper.isConnected) {
        natsWrapper.client.close();
      }

      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL,
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      setListenerReady(false);

      if (!isShuttingDown) {
        process.exit(1);
      }
    });

    new OrderCreatedListener(natsWrapper.client).listen();

    // Listener registered successfully
    setListenerReady(true);

    console.log("Expiration service is ready");
  } catch (err) {
    console.error("Failed to start expiration service:", err);
    process.exit(1);
  }
};

start();
