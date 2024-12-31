import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth'; 
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup = this.fb.group({});
  isLoading = false;
  errorMessage: string = ''; // Variable para almacenar el mensaje de error

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router,
    private loadingController: LoadingController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    
    const storedUser = this.authService.getStoredUser();
    if (storedUser.email && storedUser.password) {
      this.loginForm.patchValue({
        email: storedUser.email,
        password: storedUser.password,
      });
    }
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      try {
        this.isLoading = true;
        await this.showLoading(); // Mostrar cargando

        // Intentar iniciar sesión con Firebase
        await this.afAuth.signInWithEmailAndPassword(email, password);
        
        // Guardar datos en local storage
        this.authService.setStoredUser(email, password);
        
        // Redirigir al menú si el login es exitoso
        this.router.navigate(['/menu']);
      } catch (error) {
        this.errorMessage = 'Correo o contraseña incorrectos.'; // Mensaje de error
        console.error('Error al iniciar sesión', error);
      } finally {
        this.isLoading = false; // Finaliza el estado de carga
      }
    } else {
      // Marcar los campos como "tocados" para mostrar los errores de validación
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  async showLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'circles',
    });

    await loading.present();

    // Simular tiempo de carga
    setTimeout(async () => {
      await loading.dismiss(); // Cerrar el cargando
    }, 1000);
  }

  // Continuar como invitado
  async continueAsGuest() {
    await this.showLoading();
    this.router.navigate(['/menu']); // Redirigir al menú
  }

  navigateToResetPassword() {
    this.router.navigate(['/reset-password']);
  }
}
