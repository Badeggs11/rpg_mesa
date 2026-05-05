const express = require('express');
const router = express.Router();

const mundoController = require('../controllers/mundoController');

router.get('/mundo/mapa', mundoController.obterMapa);
router.get('/mundo/lugares/:localId', mundoController.obterLugarDetalhado);
router.get('/mundo/sentimentos/:sentimentoId', mundoController.obterSentimento);
router.get('/mundo/desejos/:desejoId', mundoController.obterDesejo);
router.get('/mundo/efeitos/:efeitoId', mundoController.obterEfeito);

module.exports = router;
