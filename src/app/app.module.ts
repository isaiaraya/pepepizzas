import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { provideHttpClient } from '@angular/common/http'; // Nueva importación



import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LocationModalComponent } from './location-modal/location-modal.component'; // Asegúrate de que la ruta sea correcta
import { CartModalComponent } from './cart-modal/cart-modal.component';
import { PaymentMethodsComponent } from './modals/payment-methods/payment-methods.component';



import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; // Si usas autenticación
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; // Si usas Firestore
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent,  LocationModalComponent, CartModalComponent, PaymentMethodsComponent ],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,   AngularFireModule.initializeApp(environment.firebaseConfig), AngularFireAuthModule, AngularFirestoreModule,  FormsModule,],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },  provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}
