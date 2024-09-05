import { APP_INITIALIZER, ApplicationConfig, provideExperimentalZonelessChangeDetection, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { IDataService, IStorageSettings, LocalStorageDataService } from './services';
import { TEAMS_SERVICE, PLAYERS_SERVICE } from './services/tokens';
import { IPlayer, ITeam } from './models';
import { seedData } from './utils/seedData';
import { ThemingService } from './services/theming.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    {
      provide: APP_INITIALIZER,
      useFactory: (ts: IDataService<ITeam>, ps: IDataService<IPlayer>) => seedData(ts, ps),
      multi: true,
      deps: [TEAMS_SERVICE, PLAYERS_SERVICE]
    },
    {
      provide: IStorageSettings,
      useValue: { delay: 500 } as IStorageSettings
    },
    {
      provide: TEAMS_SERVICE,
      useFactory: () => new LocalStorageDataService<ITeam>('team')
    },
    {
      provide: PLAYERS_SERVICE,
      useFactory: () => new LocalStorageDataService<IPlayer>('player')
    },
    ThemingService
  ]
};
