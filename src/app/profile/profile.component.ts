import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
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
    experienciaLaboral: [{ empresa: '', descripcion: '', anioInicio: '', anioCierre: '' }],
    idiomas: '',
    competencias: '',
    formacionAcademica: [{ universidad: '', carrera: '', anioInicio: '', anioCierre: '' }],
    habilidades: ''
  };

  constructor(private profileService: ProfileService) { }

  onSubmit() {
    console.log('Form data:', this.profileData);
    // Llamada al backend
    this.profileService.saveProfile(this.profileData).subscribe(
      response => {
        console.log('Datos guardados correctamente:', response);
        alert('Perfil guardado correctamente');
      },
      error => {
        console.error('Error al guardar los datos:', error);
        alert('Hubo un error al guardar los datos');
      }
    );
  }

  addExperience() {
    this.profileData.experienciaLaboral.push({ empresa: '', descripcion: '', anioInicio: '', anioCierre: '' });
  }

  removeExperience(index: number) {
    this.profileData.experienciaLaboral.splice(index, 1);
  }

  addEducation() {
    this.profileData.formacionAcademica.push({ universidad: '', carrera: '', anioInicio: '', anioCierre: '' });
  }

  removeEducation(index: number) {
    this.profileData.formacionAcademica.splice(index, 1);
  }
}
