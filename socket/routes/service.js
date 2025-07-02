import express from "express";
import { getReceiverSocketId, io } from "../index.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { bookingArray } = req.body;

    if (!bookingArray || bookingArray.length === 0) {
      console.log("first");
      return res.status(400).json({ error: "No updated bookings provided" });
    }

    const booking = bookingArray[0]; // Assuming only one booking for now

    const { providerId } = booking;

    const receiverSocketId = getReceiverSocketId(providerId);
    console.log({ receiverSocketId });
    if (!receiverSocketId) {
      console.log("Provider is not online.");
    } else {
      io.to(receiverSocketId).emit("new-booking", {
        service: booking,
      });

      console.log("New Booking event emitted to:", receiverSocketId);
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

router.post("/modify-provider", async (req, res) => {
  try {
    const { booking } = req.body;
    console.log({ booking });
    if (!booking) {
      return res.status(400).json({ error: "No updated bookings provided" });
    }

    const { providerId } = booking;

    const receiverSocketId = getReceiverSocketId(providerId);

    if (!receiverSocketId) {
      console.log("Provider is not online.");
    } else {
      io.to(receiverSocketId).emit("modify-service", {
        service: booking,
      });

      console.log("New Booking event emitted to:", receiverSocketId);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error in /api/services/modifyservice route:", error);
    res.status(500).json({
      error: "Failed to process modify service event",
      details: error.message || error,
    });
  }
});

router.post("/modify-user", async (req, res) => {
  try {
    const { booking } = req.body;
    console.log({ booking });
    if (!booking) {
      return res.status(400).json({ error: "No updated bookings provided" });
    }

    const { userId } = booking;

    const receiverSocketId = getReceiverSocketId(userId);

    if (!receiverSocketId) {
      console.log("Provider is not online.");
    } else {
      io.to(receiverSocketId).emit("modify-service", {
        service: booking,
      });

      console.log("New Booking event emitted to:", receiverSocketId);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error in /api/services/modifyservice route:", error);
    res.status(500).json({
      error: "Failed to process modify service event",
      details: error.message || error,
    });
  }
});

export default router;
