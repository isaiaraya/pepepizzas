import { Component, OnInit } from '@angular/core';
import { AddressService } from '../services/address.service';

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.page.html',
  styleUrls: ['./direcciones.page.scss'],
})
export class DireccionesPage implements OnInit {
  savedAddresses: string[] = []; // Inicializa el array de direcciones guardadas

  constructor(private addressService: AddressService) { }

  ngOnInit() {
    this.loadSavedAddresses();
  }

  loadSavedAddresses() {
    this.savedAddresses = this.addressService.getAddresses(); // Obtén las direcciones del servicio
  }

}
