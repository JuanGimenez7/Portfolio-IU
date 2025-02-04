const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const PDFDocument = require("pdfkit"); // Importa pdfkit

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint para guardar los datos del perfil en JSON (ya existente)
app.post("/api/saveProfile", (req, res) => {
  console.log("Recibí una solicitud POST en /api/saveProfile");
  console.log("Datos recibidos:", req.body);

  const profileData = req.body;

  fs.writeFile(
    "profileData.json",
    JSON.stringify(profileData, null, 2),
    (err) => {
      if (err) {
        console.error("Error al guardar el archivo:", err);
        return res
          .status(500)
          .json({ message: "Error al guardar los datos", error: err });
      }
      console.log("Archivo profileData.json guardado exitosamente");
      res.status(200).json({ message: "Datos guardados exitosamente" });
    }
  );
});

// Endpoint para generar el PDF
app.post("/api/generatePdf", (req, res) => {
  const profileData = req.body; // También podrías leer profileData.json si ya está guardado

  // Crea un nuevo documento PDF
  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
  });

  // Para capturar los datos del PDF en un buffer y enviarlo
  let buffers = [];
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {
    let pdfData = Buffer.concat(buffers);
    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment;filename=perfil.pdf",
      "Content-Length": pdfData.length,
    });
    res.end(pdfData);
  });

  // Agrega contenido al PDF (puedes personalizar el formato y estilo)
  doc.fontSize(22).text("CV Portafolio", { align: "center", underline: true });
  doc.moveDown();

  doc
    .fontSize(16)
    .text(`Nombre: ${profileData.nombre} ${profileData.apellido}`, {
      continued: true,
    });
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

  // Ejemplo para experiencia laboral (si hay más de una, iteramos)
  if (
    profileData.experienciaLaboral &&
    profileData.experienciaLaboral.length > 0
  ) {
    doc.fontSize(16).text("Experiencia Laboral:", { underline: true });
    profileData.experienciaLaboral.forEach((exp, i) => {
      doc.moveDown(0.5);
      doc.fontSize(12).text(`${i + 1}. Empresa: ${exp.empresa}`);
      doc.text(`   Descripción: ${exp.descripcion}`);
      doc.text(`   Desde: ${exp.anioInicio}  Hasta: ${exp.anioCierre}`);
    });
    doc.moveDown();
  }

  // Ejemplo para formación académica
  if (
    profileData.formacionAcademica &&
    profileData.formacionAcademica.length > 0
  ) {
    doc.fontSize(16).text("Formación Académica:", { underline: true });
    profileData.formacionAcademica.forEach((edu, i) => {
      doc.moveDown(0.5);
      doc.fontSize(12).text(`${i + 1}. Universidad: ${edu.universidad}`);
      doc.text(`   Carrera: ${edu.carrera}`);
      doc.text(`   Desde: ${edu.anioInicio}  Hasta: ${edu.anioCierre}`);
    });
    doc.moveDown();
  }

  // Otros campos (idiomas, competencias, habilidades)
  doc.fontSize(14).text(`Idiomas: ${profileData.idiomas}`);
  doc.text(`Competencias: ${profileData.competencias}`);
  doc.text(`Habilidades: ${profileData.habilidades}`);

  // Finaliza el documento
  doc.end();
});

app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
