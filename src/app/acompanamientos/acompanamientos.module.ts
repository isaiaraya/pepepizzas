import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcompanamientosPageRoutingModule } from './acompanamientos-routing.module';

import { AcompanamientosPage } from './acompanamientos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcompanamientosPageRoutingModule
  ],
  declarations: [AcompanamientosPage]
})
export class AcompanamientosPageModule {}
