const express = require('express');
const router = express.Router();
const combatController = require('../controllers/combatController');

router.post('/iniciar', combatController.iniciarCombate);
router.post('/acao', combatController.executarAcao);

module.exports = router;
