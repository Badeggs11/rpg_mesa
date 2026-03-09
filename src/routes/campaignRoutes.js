const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');

// 🌍 Iniciar campanha
router.post('/iniciar', campaignController.iniciarCampanha);

router.post('/campanha/mover', campaignController.moverJogador);

// 🎮 Jogador envia ação (CRÍTICO para o frontend!)
router.post('/acao', campaignController.executarAcaoCampanha);

// ⏳ Processar rodada manual (debug / sandbox)
router.post('/rodada', campaignController.processarRodada);

module.exports = router;
