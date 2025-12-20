const express = require("express");
const router = express.Router();
const { executarCombate } = require("../controllers/combatController");

router.post("/combate", executarCombate);

module.exports = router;
