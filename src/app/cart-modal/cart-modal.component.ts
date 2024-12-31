import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular'; // Importa AlertController
import { CartService } from '../services/cart.service';
import { AddressService } from '../services/address.service';
import { AuthService } from '../services/auth.service'; // Servicio de autenticación
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs'; // Importamos Subscription

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss'],
})
export class CartModalComponent implements OnInit, OnDestroy {
  cartItems: any[] = [];
  private cartItemsSubscription!: Subscription;
  userId: string | null = null; // Variable para almacenar el uid del usuario

  constructor(
    private modalController: ModalController,
    private cartService: CartService,
    private addressService: AddressService,
    private authService: AuthService, // Inyecta el servicio de autenticación
    private alertController: AlertController, // Inyecta AlertController
    private navController: NavController
  ) {}

  ngOnInit() {
    // Suscribirse a los cambios del carrito
    this.cartItemsSubscription = this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });

    // Obtener el UID del usuario autenticado
    this.authService.getCurrentUser().subscribe(user => {
      this.userId = user?.uid || null; // Guarda el uid o null si no hay usuario
    });
  }

  ngOnDestroy() {
    if (this.cartItemsSubscription) {
      this.cartItemsSubscription.unsubscribe();
    }
  }

  // Aumentar la cantidad de un producto
  increaseQuantity(index: number) {
    this.cartService.increaseQuantity(index);
  }

  // Disminuir la cantidad de un producto
  decreaseQuantity(index: number) {
    this.cartService.decreaseQuantity(index);
  }

  // Eliminar un producto del carrito
  removeItem(index: number) {
    this.cartService.removeItem(index);
  }

  // Obtener el total del carrito
  getTotal() {
    return this.cartService.getTotal();
  }

  // Cerrar el modal del carrito
  closeCart() {
    this.modalController.dismiss();
  }

  // Ir al pago con verificación de usuario autenticado
  async goToPayment() {
    if (this.userId) {
      // Usuario autenticado
      const total = this.getTotal();
      const deliveryCost = total >= 26000 ? 0 : 2990;
      const subtotal = total + deliveryCost;

      this.navController.navigateForward('/resumen', {
        state: { 
          cartItems: this.cartItems,
          subtotal: subtotal,
          deliveryCost: deliveryCost,
          totalCost: total + deliveryCost,
        }
      });

      this.closeCart(); // Cierra el modal después de redirigir
    } else {
      // Mostrar alerta si no está autenticado
      const alert = await this.alertController.create({
        header: 'Debes iniciar sesión',
        message: 'Inicia sesión para continuar con tu compra.',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
          },
          {
            text: 'Iniciar Sesión',
            handler: () => {
              this.closeCart(); // Cierra el modal antes de redirigir
              this.navController.navigateForward('/login'); // Redirige al login
            },
          },
        ],
      });

      await alert.present();
    }
  }
}
