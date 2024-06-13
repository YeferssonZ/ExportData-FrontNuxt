const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado a MongoDB');
}).catch(err => {
  console.error('Error al conectar a MongoDB:', err.message);
});

// Definir el esquema y modelo
const spectralSchema = new mongoose.Schema({
  FrecMax: { type: Number },
  Modox: { type: mongoose.Schema.Types.Mixed },
  ModoY: { type: mongoose.Schema.Types.Mixed },
  Modoz: { type: mongoose.Schema.Types.Mixed }
}, { collection: 'Vibraciones' });

const Spectral = mongoose.model('Spectral', spectralSchema);

// Endpoint para obtener los datos
app.get('/api/spectrals', async (req, res) => {
  try {
    const spectrals = await Spectral.find({});
    res.json(spectrals);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
