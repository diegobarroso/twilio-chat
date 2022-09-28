import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
  },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { 
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then(m => m.ChatModule)
  },
  { 
    path: ':room',
    loadChildren: () => import('./pages/room/room.module').then(m => m.RoomModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
