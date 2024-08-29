import { IStorage } from "../services";
import { IPlayer, ITeam } from "../models";
import { catchError, combineLatest, finalize, firstValueFrom, merge, of, switchMap, tap } from "rxjs";

export function seedData(teamsStorage: IStorage<ITeam>, playersStorage: IStorage<IPlayer>) {
  return async () => {
    const dataSeeded = localStorage.getItem('DATA_SEEDED') === '1';
    if (dataSeeded) {
      console.log('seed already run - skipping');
      return of(null);
    }

    console.log('seeding data');
    return await firstValueFrom(
      combineLatest([teamsStorage.add({ name: 'SG1' }), teamsStorage.add({ name: 'SG2' })]).pipe(
        switchMap(([team1, team2]) => {
          const team1Id = team1.data!.id!
          const team2Id = team2.data!.id!
          return combineLatest([
            playersStorage.add({ firstName: 'Jack', lastName: 'O\'Neil', position: 'Brankář', teamId: team1Id }),
            playersStorage.add({ firstName: 'Daniel', lastName: 'Jackson', position: 'Obránce', teamId: team1Id }),
            playersStorage.add({ firstName: 'Samantha', lastName: 'Carter', position: 'Útočník', teamId: team1Id }),
            playersStorage.add({ firstName: 'Teal\'c', lastName: '', position: 'Útočník', teamId: team1Id }),
            playersStorage.add({ firstName: 'Charles', lastName: 'Kawalsky', position: 'Brankář', teamId: team2Id }),
            playersStorage.add({ firstName: 'Carl', lastName: 'Warren', position: 'Útočník', teamId: team2Id }),
            playersStorage.add({ firstName: 'Louis', lastName: 'Ferretti', position: 'Útočník', teamId: team2Id }),
          ]);
        }),
        tap(() => {
          localStorage.setItem('DATA_SEEDED', '1');
          console.log('seed completed');
        }),
        catchError(err => {
          console.error('seed failed');
          localStorage.clear();
          return of(err);
        })
      ));
  }
}