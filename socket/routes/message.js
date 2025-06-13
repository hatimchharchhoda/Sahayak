import express from "express";
import { getReceiverSocketId, io } from "../index.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const { receiverId, content, newMessage } = await req.body;

    if (!receiverId || !content) {
      return res
        .status(400)
        .json({ error: "receiverId and content are required" });
    }

    console.log({ receiverId, content });

    const receiverSocketId = getReceiverSocketId(receiverId); // Call the function

    if (!receiverSocketId) {
      return res.status(404).json({ error: "Receiver is not connected" });
    }

    console.log(newMessage);

    const from = newMessage.senderId;

    console.log(receiverSocketId);
    io.to(receiverSocketId).emit("new-message", { content, from });

    res.json({ success: true });
  } catch (error) {
    console.error("Error in message route:", error);
    res.status(500).json({
      error: "Failed to send message",
      details: error.message || error,
    });
  }
});

export default router;
