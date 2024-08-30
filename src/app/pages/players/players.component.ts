import { Component, inject, input, OnInit, signal } from '@angular/core';
import { PLAYERS_SERVICE } from '../../services';
import { IPlayer } from '../../models';
import { take } from 'rxjs';
import { CardComponent } from '../../components/card/card.component';
import { LoaderComponent } from '../../components/loader/loader.component';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CardComponent, LoaderComponent],
  templateUrl: './players.component.html',
  styleUrl: './players.component.scss'
})
export class PlayersComponent implements OnInit {
  playersSvc = inject(PLAYERS_SERVICE)

  id = input<string>();

  players = signal<IPlayer[]>([]);
  loading = signal(false);


  ngOnInit(): void {
    this.loading.set(true);
    this.playersSvc.get(x => x.teamId === this.id()).pipe(take(1)).subscribe(x => {
      if (x.success) {
        this.players.set(x.data!)
      } else {
        console.error(x.message);
      }
      this.loading.set(false);
    })
  }
}
