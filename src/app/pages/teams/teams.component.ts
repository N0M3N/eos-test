import { Component, inject, model, OnInit, signal } from '@angular/core';
import { NotificationsService, PLAYERS_SERVICE, TEAMS_SERVICE } from '../../services';
import { ITeam } from '../../models';
import { BehaviorSubject, catchError, combineLatest, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { CardComponent } from '../../components/card/card.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faClose, faEdit, faSave, faAdd, faTrash, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CardComponent, DialogComponent, LoaderComponent, AsyncPipe, FontAwesomeModule, FormsModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent implements OnInit {
  faSearch = faSearch;
  faClose = faClose;
  faEdit = faEdit;
  faSave = faSave;
  faAdd = faAdd;
  faTrash = faTrash;
  faArrowRightToBracket = faArrowRightToBracket;

  notificationsSvc = inject(NotificationsService);
  teamsSvc = inject(TEAMS_SERVICE);
  playerSvc = inject(PLAYERS_SERVICE);
  router = inject(Router);

  filter$ = new BehaviorSubject<string>('');
  refresh$ = new BehaviorSubject<number>(0);
  loading = signal(false);

  editDialogVisible = model(false);
  confirmDialogVisible = model(false);
  teamId?: string;
  name = model<string>()

  teams$?: Observable<ITeam[]>;

  ngOnInit(): void {
    this.teams$ = combineLatest([this.filter$, this.refresh$]).pipe(
      map(([filter, _]) => filter.toLowerCase()),
      tap(() => this.loading.set(true)),
      switchMap(filter =>
        this.playerSvc.get(x => `${x.firstName} ${x.lastName}`.toLowerCase().includes(filter)).pipe(
          switchMap(players => {
            const playerTeams = (players.data ?? []).map(x => x.teamId);
            return this.teamsSvc.get(x => x.name.toLowerCase().includes(filter) || playerTeams.includes(x.id!));
          })
        )),
      map(res => {
        if (res.success) {
          this.notificationsSvc.show({ text: 'Team list refreshed', type: 'info' });
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

  openTeam(team: ITeam) {
    this.router.navigate(['players', team.id]);
  }

  onEdit(team: ITeam) {
    this.editDialogVisible.set(true);
    this.teamId = team.id;
    this.name.set(team.name);
  }

  onAdd() {
    this.editDialogVisible.set(true);
    this.teamId = undefined;
    this.name.set(undefined);
  }

  onSave() {
    const name = this.name();
    if (!name) {
      this.notificationsSvc.show({ text: 'Invalid form', type: 'error' });
      return;
    }
    (
      this.teamId ?
        this.teamsSvc.update({ id: this.teamId, name }) :
        this.teamsSvc.create({ name })
    )
      .pipe(take(1))
      .subscribe(res => {
        if (res.success) {
          this.notificationsSvc.show({ text: `Team ${this.teamId ? 'updated' : 'created'}`, type: 'success' });
          this.editDialogVisible.set(false);
          this.refresh();
        } else {
          this.notificationsSvc.show({ text: res.message!, type: 'error' });
        }
      });
  }

  onDelete(team: ITeam) {
    this.teamId = team.id;
    this.name.set(team.name);
    this.confirmDialogVisible.set(true);
  }

  onDeleteConfirmed() {
    if (this.teamId) {
      this.teamsSvc.delete({ id: this.teamId })
        .pipe(take(1))
        .subscribe(res => {
          if (res.success) {
            this.notificationsSvc.show({ text: `Team removed`, type: 'success' });
            this.confirmDialogVisible.set(false);
            this.refresh();
          } else {
            this.notificationsSvc.show({ text: res.message!, type: 'error' });
          }
        });
    }
  }

  private refresh() {
    this.refresh$.next(this.refresh$.value + 1);
  }
}
