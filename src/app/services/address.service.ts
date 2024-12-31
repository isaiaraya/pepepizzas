import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private savedAddresses: string[] = []; // Lista de direcciones guardadas
  private selectedAddress: string = ''; // Dirección seleccionada

  constructor() {}

  // Guarda una nueva dirección en el array
  saveAddress(address: string) {
    this.savedAddresses.push(address);
  }

  // Devuelve todas las direcciones guardadas
  getAddresses() {
    return this.savedAddresses;
  }

  // Establece una dirección seleccionada
  setSelectedAddress(address: string) {
    this.selectedAddress = address;
  }

  // Obtiene la dirección seleccionada
  getSelectedAddress() {
    return this.selectedAddress;
  }
}

