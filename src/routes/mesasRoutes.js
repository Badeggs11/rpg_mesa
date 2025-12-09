const express = require("express");
const router = express.Router();

const mesasController = require("../controllers/mesaControllers");

router.get("/", mesasController.listar);
router.post("/", mesasController.criar);
router.put("/", mesasController.atualizar);
router.delete("/", mesasController.remover);

module.exports = router;
