const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');

// 🌍 Processar avanço do mundo (rodada da campanha)
router.post('/rodada', campaignController.processarRodada);
router.post('/iniciar', campaignController.iniciarCampanha);

module.exports = router;
