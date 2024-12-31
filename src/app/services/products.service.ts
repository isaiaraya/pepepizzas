import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Asegúrate de usar la versión correcta de firestore
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private firestore: AngularFirestore) { }

  // Obtener productos por categoría desde la colección 'productos'
  obtenerProductos(categoria: string): Observable<any[]> {
    return this.firestore
      .collection('productos', (ref) => ref.where('categoria', '==', categoria)) // Filtra por la categoría
      .valueChanges({ idField: 'id' }); // Asegúrate de que el id esté presente
  }

  // Crear un nuevo producto
  agregarProducto(producto: any): Promise<any> {
    return this.firestore.collection('productos').add(producto);
  }

  // Actualizar un producto
  actualizarProducto(id: string, producto: any): Promise<void> {
    return this.firestore.collection('productos').doc(id).update(producto);
  }

  // Eliminar un producto
  eliminarProducto(id: string): Promise<void> {
    return this.firestore.collection('productos').doc(id).delete();
  }
}
