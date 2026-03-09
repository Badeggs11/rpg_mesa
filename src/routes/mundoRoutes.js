const express = require('express');
const router = express.Router();

const mundoController = require('../controllers/mundoController');

router.get('/mundo/mapa', mundoController.obterMapa);

module.exports = router;
