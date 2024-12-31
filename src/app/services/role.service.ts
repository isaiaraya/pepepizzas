import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private firestore: AngularFirestore) { }

  // Método para cambiar el rol de un usuario a 'admin' o 'user'
  async setUserRole(uid: string, role: string) {
    // Verificar que el rol sea uno de los valores permitidos ('admin' o 'user')
    if (role !== 'admin' && role !== 'user') {
      throw new Error('Rol inválido. Solo se permiten los roles "admin" o "user".');
    }

    try {
      // Accedemos al documento del usuario en la colección 'users' utilizando su uid
      const userRef = this.firestore.collection('users').doc(uid);

      // Actualizamos el campo 'role' con el nuevo rol
      await userRef.update({ role });

      console.log('Rol actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar el rol:', error);
      throw error;
    }
  }
}
