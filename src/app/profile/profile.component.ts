import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importa FormsModule

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule], // Agrega FormsModule en los imports
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

  onSubmit() {
    console.log('Form data:', this.profileData);
    // Aquí podrías hacer la llamada al backend para guardar los datos
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
