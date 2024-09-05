import { IDataService, NotificationsService } from "../services";
import { IPlayer, ITeam } from "../models";
import { catchError, combineLatest, firstValueFrom, of, switchMap, tap } from "rxjs";

export function seedData(teamsStorage: IDataService<ITeam>, playersStorage: IDataService<IPlayer>, notificationsSvc: NotificationsService) {
  return async () => {
    const dataSeeded = localStorage.getItem('DATA_SEEDED') === '1';
    if (dataSeeded) {
      notificationsSvc.show({ text: 'Seed already ran - skipping', type: 'info' });
      return of(null);
    }

    notificationsSvc.show({ text: 'Seeding data', type: 'info' });
    return await firstValueFrom(
      combineLatest([teamsStorage.create({ name: 'SG1' }), teamsStorage.create({ name: 'SG2' })]).pipe(
        switchMap(([team1, team2]) => {
          const team1Id = team1.data!.id!
          const team2Id = team2.data!.id!
          return combineLatest([
            playersStorage.create({ firstName: 'Jack', lastName: 'O\'Neil', position: 'Brankář', teamId: team1Id }),
            playersStorage.create({ firstName: 'Daniel', lastName: 'Jackson', position: 'Obránce', teamId: team1Id }),
            playersStorage.create({ firstName: 'Samantha', lastName: 'Carter', position: 'Útočník', teamId: team1Id }),
            playersStorage.create({ firstName: 'Teal\'c', lastName: '', position: 'Útočník', teamId: team1Id }),
            playersStorage.create({ firstName: 'Charles', lastName: 'Kawalsky', position: 'Brankář', teamId: team2Id }),
            playersStorage.create({ firstName: 'Carl', lastName: 'Warren', position: 'Útočník', teamId: team2Id }),
            playersStorage.create({ firstName: 'Louis', lastName: 'Ferretti', position: 'Útočník', teamId: team2Id }),
          ]);
        }),
        tap(() => {
          localStorage.setItem('DATA_SEEDED', '1');
          notificationsSvc.show({ text: 'Seed completed', type: 'info' });
        }),
        catchError(err => {
          notificationsSvc.show({ text: 'Seed failed', type: 'error' });
          localStorage.clear();
          return of(err);
        })
      ));
  }
}