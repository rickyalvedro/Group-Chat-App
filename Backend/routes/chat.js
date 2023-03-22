const express = require("express");

const router = express.Router();

const chatController = require("../controllers/chat");
const authentication = require("../middleware/auth");

router.post(
  "/sendMessage",
  authentication.authenticate,
  chatController.sendMessage
);

module.exports = router;
