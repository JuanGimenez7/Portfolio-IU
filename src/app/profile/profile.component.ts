import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../profile.service';
import * as L from 'leaflet';  // Importar Leaflet
import { OpenStreetMapProvider } from 'leaflet-geosearch'; // Importar Leaflet-Geosearch

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileData = {
    nombre: '',
    apellido: '',
    oficio: '',
    miPerfil: '',
    telefono: '',
    correo: '',
    paginaWeb: '',
    direccion: '',
    ciudad: '',  
    estado: '',  
    pais: '',    
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
    lat: 0,
    lng: 0
  };

  map!: L.Map;
  marker!: L.Marker;
  provider = new OpenStreetMapProvider(); // Proveedor de búsqueda

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = L.marker([51.505, -0.09], { draggable: true }).addTo(this.map)
      .bindPopup('Arrastra para seleccionar tu ubicación')
      .openPopup();

    this.marker.on('moveend', (event: any) => {
      const lat = event.target.getLatLng().lat;
      const lng = event.target.getLatLng().lng;
      this.profileData.lat = lat;
      this.profileData.lng = lng;
      this.reverseGeocode(lat, lng); // Obtener ciudad, estado y país
    });

    this.addSearchControl();
  }

  private async addSearchControl() {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Buscar ubicación...';
    input.style.position = 'absolute';
    input.style.top = '10px';
    input.style.left = '10px';
    input.style.zIndex = '1000';
    input.style.padding = '5px';
    input.style.border = '1px solid #ccc';

    document.getElementById('map')?.appendChild(input);

    input.addEventListener('change', async () => {
      const results = await this.provider.search({ query: input.value });
      if (results.length > 0) {
        const { x, y, label } = results[0];
        this.map.setView([y, x], 13);
        this.marker.setLatLng([y, x]);
        this.profileData.lat = y;
        this.profileData.lng = x;
        this.profileData.direccion = label; // Actualizar dirección con el nombre del lugar
        this.reverseGeocode(y, x); // Obtener ciudad, estado y país
      }
    });
  }

  // Función para obtener Ciudad, Estado y País desde las coordenadas
  private async reverseGeocode(lat: number, lng: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      // Imprimir la respuesta para ver qué propiedades se devuelven
      console.log('Respuesta de Nominatim:', data);

      // Verificamos varias propiedades para la ciudad
      this.profileData.ciudad = data.address.city 
        || data.address.town 
        || data.address.village 
        || data.address.municipality 
        || data.address.county 
        || '';  // Agregamos county si no tiene ciudad

      // Para el estado, revisamos más propiedades
      this.profileData.estado = data.address.state 
        || data.address.state_district 
        || data.address.region 
        || '';

      // Para el país es común que sea en country
      this.profileData.pais = data.address.country || '';

      console.log('Ubicación obtenida:', this.profileData);
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
    }
  }

  // Métodos del formulario

  onSubmit() {
    console.log('Formulario enviado:', this.profileData);
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

  generarPdf() {
    console.log('Generando PDF...');
    this.profileService.generatePdf(this.profileData).subscribe(
      (pdfBlob: Blob) => {
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

  // Método onlyText para prevenir la entrada de números
  onlyText(event: KeyboardEvent) {
    const char = String.fromCharCode(event.which);
    if (/\d/.test(char)) {
      event.preventDefault();
    }
  }
}
