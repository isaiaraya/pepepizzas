import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth'; 
import { LoadingController, ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular'; 

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  resetPasswordForm: FormGroup = this.fb.group({});
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private navController: NavController
  ) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async onSubmit() {
    if (this.resetPasswordForm.valid) {
      const { email } = this.resetPasswordForm.value;
      try {
        this.isLoading = true;
        await this.showLoading();

        // Enviar el correo de recuperación de contraseña
        await this.afAuth.sendPasswordResetEmail(email);

        // Mostrar mensaje de éxito
        this.presentToast('Enlace de recuperación enviado al correo.', 'success');
      } catch (error) {
        console.error('Error al enviar el correo:', error);
        this.presentToast('Hubo un error al enviar el correo. Verifica que el correo sea válido.', 'danger');
      } finally {
        this.isLoading = false;
      }
    } else {
      // Mostrar errores de validación
      Object.keys(this.resetPasswordForm.controls).forEach(key => {
        const control = this.resetPasswordForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  async showLoading() {
    const loading = await this.loadingController.create({
      message: 'Enviando...',
      spinner: 'circles',
    });
    await loading.present();
    setTimeout(() => loading.dismiss(), 1000);
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
    });
    await toast.present();
  }

  goBack() {
    this.navController.pop(); // Navega a la página anterior
  }
}
