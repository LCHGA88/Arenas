import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArenaService } from '../services/arena.service';

@Component({
  selector: 'app-arena',
  templateUrl: './arena.page.html',
  styleUrls: ['./arena.page.scss'],
})
export class ArenaPage implements OnInit {
  arenaId: string = '';
  team1: any[] = [];
  team2: any[] = [];

  constructor(private route: ActivatedRoute, private arenaService: ArenaService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['arenaId']) {
        this.arenaId = params['arenaId'];
        this.loadArenaDetails();
      }
    });
  }

  loadArenaDetails() {
    this.arenaService.getArenaUpdates(this.arenaId).subscribe((arena) => {
      this.team1 = arena?.team1 || [];
      this.team2 = arena?.team2 || [];
      console.log('Equipo del Jugador 1:', this.team1);
      console.log('Equipo del Jugador 2:', this.team2);
    });
  }
}
