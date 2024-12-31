import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { CartModalComponent } from '../cart-modal/cart-modal.component';
import { LocationModalComponent } from '../location-modal/location-modal.component';
import { AddressService } from '../services/address.service';
import { PaymentMethodsComponent } from '../modals/payment-methods/payment-methods.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http'; // Importación necesaria para Transbank
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importación de AngularFireAuth para obtener el userId


interface CartItem {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.page.html',
  styleUrls: ['./resumen.page.scss'],
})
export class ResumenPage implements OnInit {
  selectedPaymentMethod: string = '';
  selectedPaymentLogo: string = ''; // Almacena la ruta del logo
  cartItems: CartItem[] = []; // Lista de productos en el carrito con el tipo CartItem
  deliveryCost: number = 0; // Costo de delivery
  subtotal: number = 0; // Subtotal de la compra
  totalCost: number = 0; // Total final incluyendo delivery
  deliveryAddress: string = ''; // Dirección de entrega seleccionada
  userId: string | null = null; // Almacena el userId del usuario autenticado

  constructor(
    private navController: NavController,
    private modalController: ModalController,
    private addressService: AddressService,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth, // Servicio de autenticación
    private http: HttpClient
  ) {
    const navigation = history.state;
    if (navigation) {
      this.cartItems = navigation.cartItems || [];
      this.subtotal = navigation.subtotal || 0;
      this.deliveryCost = navigation.deliveryCost || 0;
      this.totalCost = navigation.totalCost || 0;
    } else {
      this.cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    }

    this.calculateTotal();
  }

  ngOnInit() {
    // Obtener el userId del usuario autenticado
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid; // Guardar el userId
      }
    });

    // Obtener la dirección seleccionada del servicio de direcciones
    this.deliveryAddress = this.addressService.getSelectedAddress();

    // Verificar si existe un token_ws en los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token_ws');

    if (token) {
      // Confirmar la transacción con el token
      this.http
        .post('http://localhost:3000/commit-transaction', { token })
        .subscribe(
          (response: any) => {
            console.log('Transacción confirmada:', response);
            this.navController.navigateForward('/success'); // Cambiar la ruta según corresponda
          },
          (error) => {
            console.error('Error al confirmar la transacción:', error);
          }
        );
    }
  }

  async confirmOrder() {
    if (!this.userId) {
      console.error('Error: Usuario no autenticado.');
      return;
    }

    const buyOrder = `ORDER_${new Date().getTime()}`;
    const sessionId = `SESSION_${new Date().getTime()}`;
    const returnUrl = 'http://localhost:8100/success';

    // Guardar el pedido en Firestore
    const order = {
      buyOrder,
      sessionId,
      totalCost: this.totalCost,
      deliveryAddress: this.deliveryAddress,
      cartItems: this.cartItems,
      paymentMethod: this.selectedPaymentMethod,
      paymentLogo: this.selectedPaymentLogo,
      status: 'Pending',
      timestamp: new Date(),
      userId: this.userId, // Agregar el userId al objeto del pedido
    };

    try {
      // Guardar en la colección de pedidos de Firestore
      const orderRef = await this.firestore.collection('orders').add(order);
      console.log('Pedido guardado en Firestore con ID:', orderRef.id);

      // Crear la transacción
      this.http
        .post('http://localhost:3000/create-transaction', {
          amount: this.totalCost,
          buyOrder,
          sessionId,
          returnUrl,
        })
        .subscribe(
          (response: any) => {
            // Guardar el ID del pedido en el almacenamiento local o pasarlo a la página de éxito
            localStorage.setItem('orderId', buyOrder);
            // Redirigir al formulario de pago de Transbank
            window.location.href = response.url + '?token_ws=' + response.token;
          },
          (error) => {
            console.error('Error al crear la transacción:', error);
          }
        );
    } catch (error) {
      console.error('Error al guardar el pedido en Firestore:', error);
    }
  }

  async openPaymentMethodsModal() {
    const modal = await this.modalController.create({
      component: PaymentMethodsComponent,
    });

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.selectedMethod) {
        this.selectedPaymentMethod = result.data.selectedMethod;
        this.selectedPaymentLogo = result.data.logo;
      }
    });
    return await modal.present();
  }

  async openLocationModal() {
    const modal = await this.modalController.create({
      component: LocationModalComponent,
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.deliveryAddress = data.data; // Cargar la dirección seleccionada
      }
    });

    return await modal.present();
  }

  async openCartModal() {
    const modal = await this.modalController.create({
      component: CartModalComponent,
      componentProps: { cartItems: this.cartItems },
    });
    await modal.present();
  }

  calculateTotal() {
    if (this.subtotal === 0) {
      this.subtotal = this.cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    }

    if (this.subtotal >= 26000) {
      this.deliveryCost = 0;
    } else {
      this.deliveryCost = 2990;
    }

    this.totalCost = this.subtotal + this.deliveryCost;
  }
  goBack() {
    this.navController.pop(); // Navega a la página anterior
  }
}
