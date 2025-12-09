const express = require("express");
const router = express.Router();

const personagensController = require("../controllers/personagensController");

router.get("/", personagensController.listar);
router.post("/", personagensController.criar);
router.put("/:id", personagensController.atualizar);
router.delete("/:id", personagensController.remover);

module.exports = router;

