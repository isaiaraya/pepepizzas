import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<any[]>([]);  // Comportamiento reactivo para el carrito

  constructor() {
    this.loadCart();  // Cargar carrito desde localStorage al iniciar el servicio
  }

  // Cargar carrito desde localStorage
  private loadCart() {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      this.cartItemsSubject.next(JSON.parse(storedCart));
    } else {
      this.cartItemsSubject.next([]);  // Inicializar carrito vacío
    }
  }

  // Guardar carrito en localStorage
  private saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItemsSubject.value));
  }

  // Obtener todos los productos del carrito
  getCartItems() {
    return this.cartItemsSubject.asObservable();  // Exponer el carrito como Observable
  }

  // Agregar un producto al carrito
  addToCart(product: any) {
    const cartItems = this.cartItemsSubject.value;
    const existingItem = cartItems.find(item => item.name === product.name);

    if (existingItem) {
      existingItem.quantity += 1;  // Si el producto ya está en el carrito, aumentar la cantidad
    } else {
      cartItems.push({ ...product, quantity: 1 });  // Si no está, agregarlo con cantidad 1
    }

    this.cartItemsSubject.next(cartItems); //guarda cambios
    this.saveCart();
  }

  // Aumentar la cantidad de un producto
  increaseQuantity(index: number) {
    const cartItems = this.cartItemsSubject.value;
    if (cartItems[index]) {
      cartItems[index].quantity++;  // Incrementar la cantidad
      this.cartItemsSubject.next(cartItems);
      this.saveCart();
    }
  }

  // Disminuir la cantidad de un producto
  decreaseQuantity(index: number) {
    const cartItems = this.cartItemsSubject.value;
    if (cartItems[index] && cartItems[index].quantity > 1) {
      cartItems[index].quantity--;  // Decrementar la cantidad
      this.cartItemsSubject.next(cartItems);
      this.saveCart();
    }
  }

  // Eliminar un producto del carrito
  removeItem(index: number) {
    const cartItems = this.cartItemsSubject.value;
    cartItems.splice(index, 1);  // Eliminar el producto por índice
    this.cartItemsSubject.next(cartItems);  // guardar cambios
    this.saveCart();
  }

  // Obtener el total del carrito
  getTotal() {
    const cartItems = this.cartItemsSubject.value;
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Obtener el número total de productos en el carrito
  getCartItemCount() {
    const cartItems = this.cartItemsSubject.value;
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  // Limpiar el carrito
  clearCart() {
    this.cartItemsSubject.next([]);  // Limpiar el carrito
    localStorage.removeItem('cartItems'); // Eliminar del localStorage
  }
}
