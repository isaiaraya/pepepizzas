/// <reference types="google.maps" />
import { Component, AfterViewInit } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { NavController } from '@ionic/angular'; // Asegúrate de importar NavController
@Component({
  selector: 'app-encuentranos',
  templateUrl: './encuentranos.page.html',
  styleUrls: ['./encuentranos.page.scss'],
})
export class EncuentranosPage implements AfterViewInit {
  map!: GoogleMap;
  
  // Inyectar NavController en el constructor
  constructor(private navController: NavController) {}

  async ngAfterViewInit() {
    // Cargar el mapa cuando la vista esté lista
    await this.loadMap();
  }

  async loadMap() {
    const mapElement = document.getElementById('map');
    
    if (mapElement) {
      // Inicializar el mapa dentro del contenedor 'map'
      this.map = await GoogleMap.create({
        id: 'my-map',
        element: mapElement as HTMLElement,
        apiKey: 'AIzaSyA8Di-ax7-Z8btTQdgeipLaXIG5XCBzc5I', // Reemplaza con tu clave API
        config: {
          center: {
            lat: -34.397, // Coordenadas para centrar el mapa
            lng: 150.644,
          },
          zoom: 8, // Nivel de zoom inicial
        },
      });
    } else {
      console.error('No se encontró el contenedor del mapa');
    }
  }

  goBack() {
    this.navController.pop(); // Navega a la página anterior
  }
}

