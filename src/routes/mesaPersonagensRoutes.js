const express = require("express");
const router = express.Router();

const mesaPersonagensController = require("../controllers/mesaPersonagensController");

router.post("/", mesaPersonagensController.adicionar);
router.get("/:mesa_id", mesaPersonagensController.listarPorMesa);
router.delete("/:id", mesaPersonagensController.remover);

module.exports = router;