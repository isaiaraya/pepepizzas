import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { LocationModalComponent } from '../location-modal/location-modal.component';
import { CartModalComponent } from '../cart-modal/cart-modal.component';
import { CartService } from '../services/cart.service';
import { ProductsService } from '../services/products.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit, OnDestroy {
  selectedAddress: string = 'Agregar dirección';
  productos: any[] = [];
  cartItemCount: number = 0;  // Contador de productos en el carrito
  private cartItemsSubscription!: Subscription;

  constructor(
    private router: Router,
    private modalController: ModalController,
    private cartService: CartService,
    private productsService: ProductsService
  ) {}

  ngOnInit() {

    this.cargarProductos('pizzas');
    // Nos suscribimos al carrito para obtener el contador de productos en tiempo real
    this.cartItemsSubscription = this.cartService.getCartItems().subscribe(() => {
      this.cartItemCount = this.cartService.getCartItemCount(); 
    });
  }

  ngOnDestroy() {
    
    if (this.cartItemsSubscription) {
      this.cartItemsSubscription.unsubscribe();
    }
  }

  cargarProductos(categoria: string) {
    this.productsService.obtenerProductos(categoria).subscribe((productos) => {
      this.productos = productos;
    });
  }

  // Método para actualizar el conteo de productos en el carrito
  updateCartItemCount() {
    this.cartItemCount = this.cartService.getCartItemCount();
  }

  onSegmentChange(event: any) {
    const selectedValue = event.detail.value;
    switch (selectedValue) {
      case 'pizzas':
        this.router.navigate(['/pizzas']);
        break;
      case 'bebidas':
        this.router.navigate(['/bebidas']);
        break;
      case 'acompanamientos':
        this.router.navigate(['/acompanamientos']);
        break;
      default:
        break;
    }
  }

  
  async openLocationModal() {
    const modal = await this.modalController.create({
      component: LocationModalComponent,
      cssClass: 'my-custom-class',
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.selectedAddress = data; 
    }
  }

  // Agregar productos al carrito usando el cartservice
  addToCart(name: string, price: number, image: string) {
    const product = { name, price, image };
    this.cartService.addToCart(product);  // Agregar al carrito
    console.log(`Agregado al carrito: ${name}, Precio: ${price}`);
  }

  // Método para abrir el modal del carrito
  async openCartModal() {
    const modal = await this.modalController.create({
      component: CartModalComponent,
      componentProps: { cartItems: this.cartService.getCartItems() },
    });
    modal.onWillDismiss().then(() => {
      this.updateCartItemCount();
    });
    await modal.present();
  }
}

