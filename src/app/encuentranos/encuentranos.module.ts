import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncuentranosPageRoutingModule } from './encuentranos-routing.module';

import { EncuentranosPage } from './encuentranos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncuentranosPageRoutingModule
  ],
  declarations: [EncuentranosPage]
})
export class EncuentranosPageModule {}
