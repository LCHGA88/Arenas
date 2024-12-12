import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () =>
          import('../tab1/tab1.module').then((m) => m.Tab1PageModule), // Ruta para Tab1
      },
      {
        path: 'tab2',
        loadChildren: () =>
          import('../tab2/tab2.module').then((m) => m.Tab2PageModule), // Ruta para Tab2
      },
      {
        path: 'tab3',
        loadChildren: () =>
          import('../tab3/tab3.module').then((m) => m.Tab3PageModule), // Ruta para Tab3
      },
      {
        path: 'tab4', // Nueva pestaña
        loadChildren: () => import('../tab4/tab4.module').then(m => m.Tab4PageModule),
      },
      {
        path: 'tab-perfil', // Nueva pestaña
        loadChildren: () => import('../tab-perfil/tab-perfil.module').then(m => m.TabPerfilPageModule),
      },
      {
        path: '',
        redirectTo: 'tab1', // Redirigir a tab1 si no hay ruta específica
        pathMatch: 'full',
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
