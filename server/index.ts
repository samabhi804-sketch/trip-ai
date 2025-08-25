import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleChatWithAgent } from "./routes/ai-agents";
import { getTripById, getAllTrips, createTrip, updateTrip, deleteTrip } from "./routes/trips";
import { searchFlights, getFlightDetails } from "./routes/flights";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // AI Agent routes
  app.post("/api/chat", handleChatWithAgent);

  // Trip management routes
  app.get("/api/trips", getAllTrips);
  app.get("/api/trips/:tripId", getTripById);
  app.post("/api/trips", createTrip);
  app.put("/api/trips/:tripId", updateTrip);
  app.delete("/api/trips/:tripId", deleteTrip);

  // Flight search routes (Skyscanner integration)
  app.post("/api/flights/search", searchFlights);
  app.get("/api/flights/:flightId", getFlightDetails);

  return app;
}
