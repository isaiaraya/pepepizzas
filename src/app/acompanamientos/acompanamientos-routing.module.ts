import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcompanamientosPage } from './acompanamientos.page';

const routes: Routes = [
  {
    path: '',
    component: AcompanamientosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcompanamientosPageRoutingModule {}
