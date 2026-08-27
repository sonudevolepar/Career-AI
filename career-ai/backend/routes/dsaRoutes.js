const express = require("express");

const router = express.Router();

// OLD:
// const { runJavaCode } = require("../controllers/dsaController");

// NEW:
const { runCode } = require("../controllers/dsaController");

// OLD:
// router.post("/run", runJavaCode);

// NEW:
router.post("/run", runCode);

module.exports = router;