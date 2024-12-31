import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EncuentranosPage } from './encuentranos.page';

const routes: Routes = [
  {
    path: '',
    component: EncuentranosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EncuentranosPageRoutingModule {}
