const express = require("express");

const router = express.Router();

const {
  chatWithAssistant,
} = require("../controllers/aiAssistantController");

router.post("/chat", chatWithAssistant);

module.exports = router;