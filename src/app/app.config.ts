import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { IStorage, IStorageSettings, LocalListStorage } from './services';
import { TEAMS_STORAGE, PLAYERS_STORAGE } from './services/tokens';
import { IPlayer, ITeam } from './models';
import { seedData } from './utils/seedData';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: (ts: IStorage<ITeam>, ps: IStorage<IPlayer>) => seedData(ts, ps),
      multi: true,
      deps: [TEAMS_STORAGE, PLAYERS_STORAGE]
    },
    {
      provide: IStorageSettings,
      useValue: { delay: 500 } as IStorageSettings
    },
    {
      provide: TEAMS_STORAGE,
      useFactory: () => new LocalListStorage<ITeam>('team')
    },
    {
      provide: PLAYERS_STORAGE,
      useFactory: () => new LocalListStorage<IPlayer>('player')
    }
  ]
};
