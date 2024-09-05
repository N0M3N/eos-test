import { Component, inject, input, model, OnInit, signal } from '@angular/core';
import { NotificationsService, PLAYERS_SERVICE, TEAMS_SERVICE } from '../../services';
import { IPlayer, ITeam } from '../../models';
import { BehaviorSubject, catchError, combineLatest, filter, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { CardComponent } from '../../components/card/card.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faSearch, faSave, faClose, faEdit, faAdd, faTrash } from '@fortawesome/free-solid-svg-icons';
import { DialogComponent } from "../../components/dialog/dialog.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CardComponent, LoaderComponent, AsyncPipe, FontAwesomeModule, DialogComponent, FormsModule],
  templateUrl: './players.component.html',
  styleUrl: './players.component.scss'
})
export class PlayersComponent implements OnInit {
  faArrowLeft = faArrowLeft;
  faSearch = faSearch;
  faSave = faSave;
  faClose = faClose;
  faEdit = faEdit;
  faAdd = faAdd;
  faTrash = faTrash;

  notificationsSvc = inject(NotificationsService);
  teamsSvc = inject(TEAMS_SERVICE);
  playersSvc = inject(PLAYERS_SERVICE);
  router = inject(Router);

  id = input<string>();
  teamId$ = toObservable(this.id);

  filter$ = new BehaviorSubject<string>('');
  refresh$ = new BehaviorSubject<number>(0);
  loading = signal(false);

  editDialogVisible = model(false);
  confirmDialogVisible = model(false);
  playerId?: string;
  firstName = model<string>()
  lastName = model<string>()
  position = model<string>()

  team$?: Observable<ITeam | null>;
  players$?: Observable<IPlayer[]>;

  ngOnInit(): void {
    this.team$ = this.teamId$.pipe(
      tap(() => this.loading.set(true)),
      switchMap(id => this.teamsSvc.get(x => x.id === id)),
      map(x => x.success ? x.data![0] : null),
      catchError(err => {
        this.notificationsSvc.show({ text: err.message, type: 'error' });
        return of(null)
      }),
      tap(() => this.loading.set(false))
    );

    this.players$ = combineLatest([this.filter$.pipe(map(x => x.toLowerCase())), this.team$, this.refresh$]).pipe(
      filter(([_, team]) => !!team),
      tap(() => this.loading.set(true)),
      switchMap(([filter, team]) => this.playersSvc.get(x => x.teamId === team!.id && (`${x.firstName} ${x.lastName}`.toLowerCase().includes(filter) || x.position.toLowerCase().includes(filter)))),
      map(res => {
        if (res.success) {
          this.notificationsSvc.show({ text: 'Player list refreshed', type: 'info' });
          return res.data ?? [];
        } else {
          return [];
        }
      }),
      catchError(err => {
        this.notificationsSvc.show({ text: err.message, type: 'error' });
        return of([]);
      }),
      tap(() => this.loading.set(false))
    )
  }

  onFilterChange(event: any) {
    this.filter$.next((event.target as HTMLInputElement).value);
  }

  onEdit(player: IPlayer) {
    this.editDialogVisible.set(true);
    this.playerId = player.id;
    this.firstName.set(player.firstName);
    this.lastName.set(player.lastName);
    this.position.set(player.position);
  }

  onAdd() {
    this.editDialogVisible.set(true);
    this.playerId = undefined;
    this.firstName.set(undefined);
    this.lastName.set(undefined);
    this.position.set(undefined);
  }

  onSave() {
    const firstName = this.firstName(), lastName = this.lastName(), position = this.position(), teamId = this.id();
    if (!firstName || !lastName || !position || !teamId) {
      this.notificationsSvc.show({ text: 'Invalid form', type: 'error' });
      return;
    }
    (
      this.playerId ?
        this.playersSvc.update({ id: this.playerId, firstName, lastName, position, teamId }) :
        this.playersSvc.create({ firstName, lastName, position, teamId })
    )
      .pipe(take(1))
      .subscribe(res => {
        if (res.success) {
          this.notificationsSvc.show({ text: `Player ${this.playerId ? 'updated' : 'created'}`, type: 'success' });
          this.editDialogVisible.set(false);
          this.refresh();
        } else {
          this.notificationsSvc.show({ text: res.message!, type: 'error' });
        }
      });
  }

  onDelete(player: IPlayer) {
    this.playerId = player.id;
    this.firstName.set(player.firstName);
    this.lastName.set(player.lastName);
    this.position.set(player.position);
    this.confirmDialogVisible.set(true);
  }

  onDeleteConfirmed() {
    if (this.playerId) {
      this.playersSvc.delete({ id: this.playerId })
        .pipe(take(1))
        .subscribe(res => {
          if (res.success) {
            this.notificationsSvc.show({ text: `Player removed`, type: 'success' });
            this.confirmDialogVisible.set(false);
            this.refresh();
          } else {
            this.notificationsSvc.show({ text: res.message!, type: 'error' });
          }
        });
    }
  }

  onBack() {
    this.router.navigate(['']);
  }

  private refresh() {
    this.refresh$.next(this.refresh$.value + 1);
  }
}
