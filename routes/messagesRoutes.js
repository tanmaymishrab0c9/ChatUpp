const router=require("express").Router();
const Message=require("../models/Message");
const auth=require("../middleware/authMiddleware");

router.get("/", auth, async (req, res) => {
  try {
    const page=parseInt(req.query.page) || 1;
    const limit=20;

    const total=await Message.countDocuments();

    const messages=await Message.find()
      .populate("sender", "username")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      messages: messages.reverse()
    });

  } catch (err) {
    res.status(500).json({ error: "Error fetching messages" });
  }
});

module.exports=router;