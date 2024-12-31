import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-success',
  templateUrl: './success.page.html',
  styleUrls: ['./success.page.scss'],
})
export class SuccessPage implements OnInit {
  orderId: string = '';


  constructor(private navController: NavController) { }

  ngOnInit() {
     // Obtener el ID del pedido del almacenamiento local
  const orderId = localStorage.getItem('orderId');

  if (orderId) {
    this.orderId = orderId;
  } else {
    console.error('ID del pedido no encontrado.');
  }
  }

   // Función para navegar a la página principal
   goToHome() {
    this.navController.navigateRoot('/menu');
  }

}
