import { Component, inject, OnInit, signal } from '@angular/core';
import { TEAMS_SERVICE } from '../../services';
import { ITeam } from '../../models';
import { take } from 'rxjs';
import { CardComponent } from '../../components/card/card.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CardComponent, LoaderComponent],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent implements OnInit {
  teamsSvc = inject(TEAMS_SERVICE);
  router = inject(Router);

  teams = signal<ITeam[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.loading.set(true);
    this.teamsSvc.get().pipe(take(1)).subscribe(x => {
      if (x.success) {
        this.teams.set(x.data!)
      } else {
        console.error(x.message);
      }
      this.loading.set(false);
    })
  }

  openTeam(team: ITeam) {
    this.router.navigate(['players', team.id]);
  }
}
