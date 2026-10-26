 
import { Routes } from '@angular/router';
 
// Dashboard
//import { Dashboard } from './components/dashboard';
 
// Crops
import { CropListComponent } from './components/crops/crop-list/crop-list';
import { CropFormComponent } from './components/crops/crop-form/crop-form';
 
// Farmers
import { FarmerListComponent } from './components/farmer/farmer-list/farmer-list'; 
import { FarmerFormComponent } from './components/farmer/farmer-form/farmer-form'; 
 
// Sensors
import { SensorListComponent } from './components/sensor/sensor-list/sensor-list'; 
import { SensorFormComponent } from './components/sensor/sensor-form/sensor-form'; 

import { CultivationListComponent } from './components/cultivation/cultivation-list/cultivation-list';
import { CultivationFormComponent } from './components/cultivation/cultivation-form/cultivation-form';
import { DashboardComponent } from './components/dashboard/dashboard';
 
export const routes: Routes = [
  // ✅ Make Dashboard the default
//   { path: '', redirectTo:'crops',component:CropListComponent },
  { path: '', component: DashboardComponent, pathMatch: 'full' },
  // Feature pages
  { path: 'crops', component: CropListComponent },
  { path: 'crops/new', component: CropFormComponent },
  { path: 'crops/:id/edit', component: CropFormComponent },
 
  { path: 'farmers', component: FarmerListComponent },
  { path: 'farmers/new', component: FarmerFormComponent },
  { path: 'farmers/:id/edit', component: FarmerFormComponent },
 
{ path: 'sensors', component: SensorListComponent },
{ path: 'sensors/new', component: SensorFormComponent },
{ path: 'sensors/:id/edit', component: SensorFormComponent },


{ path: 'cultivations', component: CultivationListComponent },
{ path: 'cultivations/new', component: CultivationFormComponent},
// { path: 'cultivations/:id/edit', component: CultivationFormComponent},
{ path: 'cultivations/:farmerId/:cropId/edit', component: CultivationFormComponent},
 
  // (Optional) wildcard → go back to dashboard
  { path: '**', redirectTo: '' }
];
 
 