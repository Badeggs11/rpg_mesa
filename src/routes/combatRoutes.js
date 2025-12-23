const express = require('express');
const router = express.Router();
const combatController = require('../controllers/combatController');

router.post('/combate/iniciar', combatController.iniciarCombate);
router.post('/combate/acao', combatController.executarAcao);

module.exports = router;
