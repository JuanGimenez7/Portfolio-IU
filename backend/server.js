const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Definición de rutas después de los middlewares
app.post('/api/saveProfile', (req, res) => {
  console.log('Recibí una solicitud POST en /api/saveProfile');
  console.log('Datos recibidos:', req.body);

  const profileData = req.body;

  fs.writeFile('profileData.json', JSON.stringify(profileData, null, 2), (err) => {
    if (err) {
      console.error('Error al guardar el archivo:', err);
      return res.status(500).json({ message: 'Error al guardar los datos', error: err });
    }
    console.log('Archivo profileData.json guardado exitosamente');
    res.status(200).json({ message: 'Datos guardados exitosamente' });
  });
});

app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
