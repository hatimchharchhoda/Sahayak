import express from "express";
import { getReceiverSocketId, io } from "../index.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { updatedBookings } = req.body;

    if (!updatedBookings || updatedBookings.length === 0) {
      return res.status(400).json({ error: "No updated bookings provided" });
    }

    const booking = updatedBookings[0]; // Assuming only one booking for now

    const { providerId } = booking;

    const receiverSocketId = getReceiverSocketId(providerId);

    if (!receiverSocketId) {
      console.log("Provider is not online.");
    } else {
      io.to(receiverSocketId).emit("payment", {
        service: booking,
      });

      console.log("Payment event emitted to:", receiverSocketId);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error in /api/payment route:", error);
    res.status(500).json({
      error: "Failed to process payment event",
      details: error.message || error,
    });
  }
});

export default router;
