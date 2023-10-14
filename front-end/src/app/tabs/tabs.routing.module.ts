import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsComponent } from './tabs.component';

const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      {
        path: 'profile',
        loadChildren: (): Promise<any> => import('../profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'configurations',
        loadChildren: (): Promise<any> =>
          import('../configurations/configurations.module').then(m => m.ConfigurationsModule)
      },
      {
        path: 'event-registrations',
        loadChildren: (): Promise<any> => import('../registrations/registration.module').then(m => m.RegistrationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class TabsComponentRoutingModule {}
