import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss'],
})
export class PaymentMethodsComponent  implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  closePayment() {
    this.modalController.dismiss();
  }

  selectPaymentMethod(method: string) {
    let logoPath = '';

    // Definir la ruta del logo según el método de pago seleccionado
    if (method === 'Webpay') {
      logoPath = 'assets/img/metodospago/1.Webpay_FB_80px.png'; // Ruta del logo de Webpay
    }

    // Pasar tanto el nombre como la ruta del logo al componente principal
    this.modalController.dismiss({
      'selectedMethod': method,
      'logo': logoPath
    });
  }

}
