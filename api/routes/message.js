const router = require("express").Router();
const Message = require("./../models/Message");
router.post("/", (req, res) => {
    res.send(hello)
});

module.exports = router;
