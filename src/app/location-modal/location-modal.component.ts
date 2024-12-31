import { Component, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { AddressService } from '../services/address.service'; // Asegúrate de importar tu servicio

declare var google: any;

@Component({
  selector: 'app-location-modal',
  templateUrl: './location-modal.component.html',
  styleUrls: ['./location-modal.component.scss'],
})
export class LocationModalComponent implements AfterViewInit {
  map: any;
  selectedSegment: string = 'delivery';
  searchQuery: string = '';
  suggestions: any[] = [];
  currentAddress: string = ''; // Dirección actual
  marker: any;
  saveAddress: boolean = false; // Propiedad para el checkbox

  constructor(private modalController: ModalController, private addressService: AddressService) {}

  ngAfterViewInit() {
    this.initMap();
  }

  closeModal() {
    this.modalController.dismiss();
  }

  async getCurrentLocation() {
    try {
      if (this.isWebPlatform()) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              this.setMapPosition(lat, lng);
              this.reverseGeocode(lat, lng); // Obtener la dirección actual
            },
            (error) => {
              console.error('Error al obtener la ubicación:', error);
            }
          );
        } else {
          console.error('Geolocalización no soportada en este navegador.');
        }
      } else {
        const permission = await Geolocation.requestPermissions();
        if (permission.location === 'granted') {
          const coordinates = await Geolocation.getCurrentPosition();
          const lat = coordinates.coords.latitude;
          const lng = coordinates.coords.longitude;
          this.setMapPosition(lat, lng);
          this.reverseGeocode(lat, lng); // Obtener la dirección actual
        } else {
          console.error('Permisos de ubicación no concedidos');
        }
      }
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    }
  }

  reverseGeocode(lat: number, lng: number) {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng };

    geocoder.geocode({ location: latlng }, (results: any, status: any) => {
      if (status === 'OK' && results && results[0]) {
        this.currentAddress = results[0].formatted_address; // Almacenar la dirección obtenida
        this.searchQuery = this.currentAddress; // Actualiza el campo de búsqueda
        this.suggestions.unshift({ description: this.currentAddress });
      } else {
        console.error('Error al obtener la dirección:', status);
      }
    });
  }

  initMap() {
    const defaultLatLng = { lat: -33.4489, lng: -70.6693 }; // Coordenadas predeterminadas para Santiago, Chile
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: defaultLatLng,
      zoom: 14,
    });

    this.map.addListener('click', (event: any) => {
      const clickedLocation = event.latLng;
      if (this.marker) {
        this.marker.setPosition(clickedLocation);
      } else {
        this.marker = new google.maps.Marker({
          position: clickedLocation,
          map: this.map,
        });
      }
      this.reverseGeocode(clickedLocation.lat(), clickedLocation.lng());
    });
  }

  setMapPosition(lat: number, lng: number) {
    const latLng = new google.maps.LatLng(lat, lng);
    this.map.setCenter(latLng);
    if (this.marker) {
      this.marker.setPosition(latLng);
    } else {
      this.marker = new google.maps.Marker({
        position: latLng,
        map: this.map,
      });
    }
  }

  searchAddress() {
    if (this.searchQuery.length < 3) {
      this.suggestions = [];
      return;
    }

    const service = new google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      { input: this.searchQuery, componentRestrictions: { country: 'cl' } },
      (predictions: any[], status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          this.suggestions = predictions;
        } else {
          this.suggestions = [];
        }
      }
    );
  }

  selectSuggestion(suggestion: any) {
    const placesService = new google.maps.places.PlacesService(this.map);
    placesService.getDetails({ placeId: suggestion.place_id }, (place: any, status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        this.setMapPosition(lat, lng);
        this.searchQuery = place.formatted_address;
        this.suggestions = [];
      }
    });
  }

  useSelectedAddress() {
    if (this.saveAddress) {
      this.addressService.saveAddress(this.searchQuery); // Guardar dirección
    }
    this.addressService.setSelectedAddress(this.searchQuery); // Establecer dirección seleccionada
    this.modalController.dismiss(this.searchQuery); // Devolver la dirección seleccionada
  }

  isWebPlatform(): boolean {
    return !((window as any).Capacitor && (window as any).Capacitor.isNativePlatform());
  }
}

