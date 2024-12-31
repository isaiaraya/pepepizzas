import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { RoleService } from '../services/role.service'; // Importar el servicio

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  users: any[] = []; // Lista de usuarios

  constructor(
    private firestore: AngularFirestore, // Firestore
    private alertController: AlertController, // Para mostrar alertas
    private roleService: RoleService // Inyectar el servicio
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  // Cargar todos los usuarios desde Firestore
  loadUsers() {
    this.firestore
      .collection('users')
      .valueChanges({ idField: 'uid' }) // Incluye el campo uid
      .subscribe((data: any[]) => {
        this.users = data; // Almacena los usuarios en la lista
      });
  }

  async editRole(user: any) {
    const alert = await this.alertController.create({
      header: `Editar rol de ${user.name}`,
      inputs: [
        {
          name: 'role',
          type: 'text',
          placeholder: 'Ingrese nuevo rol',
          value: user.role, // Valor actual del rol
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (data.role) {
              try {
                // Usar el servicio para actualizar el rol
                await this.roleService.setUserRole(user.uid, data.role);
                console.log('Rol actualizado correctamente');
              } catch (error) {
                console.error('Error al actualizar el rol:', error);
              }
            }
          },
        },
      ],
    });
  
    await alert.present();
  }
}