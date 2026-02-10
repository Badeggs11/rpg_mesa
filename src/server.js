const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const personagensRoutes = require('./routes/personagensRoutes');
const mesasRoutes = require('./routes/mesasRoutes');
const mesaPersonagensRoutes = require('./routes/mesaPersonagensRoutes');
const combatRoutes = require('./routes/combatRoutes');

app.use('/api/personagens', personagensRoutes);
app.use('/api/mesas', mesasRoutes);
app.use('/api/mesa-personagens', mesaPersonagensRoutes);
app.use('/api/combates', combatRoutes);

app.get('/', (req, res) => {
  res.json({ mensagem: 'Servidor RPG funcionando!' });
});
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
