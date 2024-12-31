import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

// Definir la interfaz para los pedidos
interface Order {
  buyOrder: string;
  timestamp: any; 
  cartItems: any[]; 
  totalCost: number;
  orderDate?: string; 
  userId?: string; 
}

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit {
  orders: Order[] = []; // Lista para almacenar los pedidos del usuario autenticado
  userId: string | null = null; // Almacenar el UID del usuario autenticado

  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {}

  ngOnInit() {
    // Obtener el usuario autenticado
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid; // Obtener el UID del usuario autenticado
        this.loadUserOrders(); // Cargar los pedidos de este usuario
      } else {
        this.userId = null;
        this.orders = []; // Limpiar los pedidos si no hay usuario autenticado
      }
    });
  }

  // Método para cargar los pedidos del usuario autenticado
  private loadUserOrders() {
    if (!this.userId) return; // Verificar que el usuario esté autenticado

    // Obtener los pedidos donde el campo userId coincide con el UID del usuario
    this.firestore
      .collection<Order>('orders', (ref) => ref.where('userId', '==', this.userId))
      .get()
      .toPromise() // Usamos `toPromise` para esperar a que se resuelvan los pedidos antes de continuar
      .then((querySnapshot) => {
        if (!querySnapshot) {
          console.error('No se pudieron cargar los pedidos');
          return;
        }

        this.orders = []; // Limpiar la lista antes de cargar los nuevos pedidos
        querySnapshot.forEach((doc) => {
          const order = doc.data() as Order;

          // Convertir el timestamp en una fecha legible
          if (order.timestamp) {
            const orderDate = new Date(order.timestamp.seconds * 1000).toLocaleString();
            order.orderDate = orderDate; // Guardar la fecha en el objeto de cada pedido
          }

          // Añadir el pedido con su fecha a la lista de orders
          this.orders.push(order);
        });
      })
      .catch((error) => {
        console.error('Error al cargar los pedidos:', error);
      });
  }
}








