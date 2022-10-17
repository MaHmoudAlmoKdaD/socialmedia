const router = require("express").Router();
const Conversation = require("../models/Conversation");
// NEW CONVERSATION
router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.sendId, req.body.receiverId],
  });
  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (error) {
    res.status(500).json(error);
  }
});

// NEW CONVERSATION OF A USER

module.exports = router;
