const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const PDFDocument = require('pdfkit');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Aumenta el límite para manejar imágenes en base64
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Endpoint para guardar el perfil en un archivo JSON
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

// Función auxiliar para agregar contenido al PDF
function addPDFContent(doc, profileData) {
  doc.fontSize(22).text('CV Portafolio', { align: 'center', underline: true });
  doc.moveDown();

  doc.fontSize(16).text(`Nombre: ${profileData.nombre} ${profileData.apellido}`);
  doc.moveDown();
  doc.fontSize(14).text(`Oficio: ${profileData.oficio}`);
  doc.moveDown();
  doc.fontSize(12).text(`Perfil: ${profileData.miPerfil}`);
  doc.moveDown();
  doc.text(`Teléfono: ${profileData.telefono}`);
  doc.text(`Correo: ${profileData.correo}`);
  doc.text(`Página Web: ${profileData.paginaWeb}`);
  doc.text(`Dirección: ${profileData.direccion}`);
  doc.moveDown();

  // Si se cargó una foto, la agregamos al PDF
  if (profileData.fotoUrl) {
    const base64Data = profileData.fotoUrl.replace(/^data:image\/\w+;base64,/, '');
    doc.image(Buffer.from(base64Data, 'base64'), { fit: [150, 150], align: 'center' });
    doc.moveDown();
  }

  // Sección de experiencia laboral
  if (profileData.experienciaLaboral && profileData.experienciaLaboral.length > 0) {
    doc.fontSize(16).text('Experiencia Laboral:', { underline: true });
    profileData.experienciaLaboral.forEach((exp, i) => {
      doc.moveDown(0.5);
      doc.fontSize(12).text(`${i + 1}. Empresa: ${exp.empresa}`);
      doc.text(`   Descripción: ${exp.descripcion}`);
      doc.text(`   Desde: ${exp.anioInicio}  Hasta: ${exp.anioCierre}`);
    });
    doc.moveDown();
  }

  // Otros campos
  doc.fontSize(14).text(`Idiomas: ${profileData.idiomas}`);
  doc.text(`Competencias: ${profileData.competencias}`);
  doc.text(`Habilidades: ${profileData.habilidades}`);
}

// Endpoint para descargar el PDF (se envía directamente al cliente)
app.post('/api/downloadPdf', (req, res) => {
  const profileData = req.body;

  // Configuramos las cabeceras para que el navegador descargue el PDF
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment;filename=perfil.pdf');

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  // Conectamos el stream del PDF directamente a la respuesta
  doc.pipe(res);

  addPDFContent(doc, profileData);

  // Finalizamos el documento, lo que cierra el stream y completa la respuesta
  doc.end();
});

// Endpoint para guardar el PDF en el servidor
app.post('/api/savePdf', (req, res) => {
  const profileData = req.body;
  const filePath = 'perfil.pdf';

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  addPDFContent(doc, profileData);
  doc.end();

  // Cuando el stream termina de escribir el PDF en el disco, enviamos la respuesta
  writeStream.on('finish', () => {
    res.status(200).json({ message: `PDF guardado correctamente en el servidor como ${filePath}` });
  });
  writeStream.on('error', (err) => {
    console.error('Error al guardar el PDF:', err);
    res.status(500).json({ message: 'Error al guardar el PDF', error: err });
  });
});

app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
