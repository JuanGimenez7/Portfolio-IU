import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  profileData = {
    nombre: '',
    apellido: '',
    oficio: '',
    miPerfil: '',
    telefono: '',
    correo: '',
    paginaWeb: '',
    direccion: '',
    experienciaLaboral: [
      { empresa: '', descripcion: '', anioInicio: '', anioCierre: '' },
    ],
    idiomas: '',
    competencias: '',
    formacionAcademica: [
      { universidad: '', carrera: '', anioInicio: '', anioCierre: '' },
    ],
    habilidades: '',
    fotoUrl: '',
  };

  constructor(private profileService: ProfileService) {}

  onSubmit() {
    console.log('Form data:', this.profileData);
    // Llamada al backend
    this.profileService.saveProfile(this.profileData).subscribe(
      (response) => {
        console.log('Datos guardados correctamente:', response);
        alert('Perfil guardado correctamente');
      },
      (error) => {
        console.error('Error al guardar los datos:', error);
        alert('Hubo un error al guardar los datos');
      }
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileData.fotoUrl = e.target.result; // Guarda la URL de la imagen en base64
      };
      reader.readAsDataURL(file);
    }
  }

  // Función para prevenir la entrada de números en campos no permitidos
  onlyText(event: KeyboardEvent) {
    const char = String.fromCharCode(event.which);
    // Si el carácter es un dígito, prevenir su entrada
    if (/\d/.test(char)) {
      event.preventDefault();
    }
  }

  generarPdf() {
    this.profileService.generatePdf(this.profileData).subscribe(
      (pdfBlob: Blob) => {
        // Crea una URL y descarga el PDF
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'perfil.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error al generar el PDF:', error);
      }
    );
  }

  guardarPdf() {
    this.profileService.savePdf(this.profileData).subscribe(
      (response) => {
        console.log('PDF guardado correctamente:', response);
        alert('PDF guardado correctamente en el servidor');
      },
      (error) => {
        console.error('Error al guardar el PDF:', error);
        alert('Hubo un error al guardar el PDF');
      }
    );
  }

  addExperience() {
    this.profileData.experienciaLaboral.push({
      empresa: '',
      descripcion: '',
      anioInicio: '',
      anioCierre: '',
    });
  }

  removeExperience(index: number) {
    this.profileData.experienciaLaboral.splice(index, 1);
  }

  addEducation() {
    this.profileData.formacionAcademica.push({
      universidad: '',
      carrera: '',
      anioInicio: '',
      anioCierre: '',
    });
  }

  removeEducation(index: number) {
    this.profileData.formacionAcademica.splice(index, 1);
  }
}
