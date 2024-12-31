import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Firebase Auth
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Firestore
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['../login/login.page.scss'],
})
export class SignupPage implements OnInit {
  signupForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth, // Firebase Auth
    private firestore: AngularFirestore, // Firestore
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    // Inicializar el formulario con validaciones
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$')]],
      phone: ['', [Validators.required, Validators.pattern('9[0-9]{8}')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/)
      ]]
    });
  }

  ngOnInit() {}

  // Validar que el nombre solo tenga letras
  validateName(event: any) {
    const input = event.target.value;
    event.target.value = input.replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1 ]/g, '');
  }

  // Validar que el teléfono solo tenga números
  validatePhone(event: any) {
    const input = event.target.value;
    event.target.value = input.replace(/[^0-9]/g, '');
  }

  // Función para registrar el usuario
  async onSubmit() {
    if (this.signupForm.valid) {
      const { email, password, name, phone } = this.signupForm.value;

      const loading = await this.loadingController.create({
        message: 'Creando cuenta...',
        spinner: 'crescent',
      });
      await loading.present();

      // Llamar a la función de creación de cuenta
      await this.createAccount(email, password, name, phone, loading);
    } else {
      Object.keys(this.signupForm.controls).forEach(key => {
        const control = this.signupForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  async createAccount(email: string, password: string, name: string, phone: string, loading: HTMLIonLoadingElement) {
    this.isLoading = true;

    try {
      // Crear cuenta en Firebase Authentication
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const { uid } = userCredential.user!;

      // Guardar los datos en Firestore
      await this.firestore.collection('users').doc(uid).set({
        name,
        email,
        phone,
        role: 'user', // Rol por defecto
        uid,
      });

      const alert = await this.alertController.create({
        header: 'Registro exitoso',
        message: 'Tu cuenta ha sido creada exitosamente.',
        buttons: [{
          text: 'OK',
          handler: async () => {
            this.router.navigate(['/menu']);
          }
        }]
      });

      await alert.present();
    } catch (error) {
      console.error('Error al crear la cuenta', error);

      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo crear la cuenta. Por favor intenta de nuevo.',
        buttons: ['OK']
      });

      await alert.present();
    } finally {
      await loading.dismiss();
      this.isLoading = false;
    }
  }

  navigateToResetPassword() {
    this.router.navigate(['/reset-password']);
  }
}

