import { Routes } from '@angular/router';
import { TeamsComponent } from './pages/teams/teams.component';
import { PlayersComponent } from './pages/players/players.component';
import { PlayerComponent } from './pages/player/player.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: TeamsComponent
  },
  {
    path: 'players/:id',
    component: PlayersComponent
  },
  {
    path: 'player/:id',
    component: PlayerComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
