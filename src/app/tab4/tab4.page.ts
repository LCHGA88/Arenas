import { Component, OnInit, OnDestroy } from '@angular/core';
import { ArenaService } from '../services/arena.service';
import { TeamService } from '../services/team.service';
import { AlertController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit, OnDestroy {
  arenaName: string = '';
  arenaPassword: string = '';
  arenaInfo: any = null;
  errorMessage: string = '';
  arenaId: string = '';
  isReady: boolean = false;
  userTeam: any[] = [];
  arenaSubscription: Subscription | null = null;

  constructor(
    private arenaService: ArenaService,
    private teamService: TeamService,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.loadUserTeam();
  }

  ngOnDestroy() {
    if (this.arenaSubscription) {
      this.arenaSubscription.unsubscribe();
    }
  }

  loadUserTeam() {
    this.teamService.getUserTeam().subscribe(
      (data) => {
        this.userTeam = data.map((pokemon) => ({
          id: pokemon.id,
          name: pokemon.name,
          image: pokemon.image,
          hp: pokemon.hp,
          level: pokemon.level || 50,
          stats: pokemon.stats || [],
        }));
        console.log('Equipo del Usuario cargado:', this.userTeam);
      },
      (error) => {
        console.error('Error al cargar el equipo del usuario:', error);
      }
    );
  }

  async createArena() {
    try {
      this.arenaInfo = await this.arenaService.createArena(
        this.arenaName,
        this.arenaPassword,
        this.userTeam
      );
      this.arenaId = this.arenaInfo.id;
      console.log('Arena creada:', this.arenaInfo);

      this.subscribeToArenaUpdates(this.arenaId);
    } catch (error) {
      this.errorMessage = 'Error al crear la arena.';
      console.error(this.errorMessage, error);
    }
  }

  async searchArena() {
    try {
      const foundArena = await this.arenaService.searchArena(this.arenaPassword, this.userTeam);
      if (foundArena) {
        this.arenaInfo = foundArena;
        this.arenaId = this.arenaInfo.id;
        console.log('Arena encontrada:', this.arenaInfo);
        this.isReady = this.arenaInfo.status === 'ready';

        this.subscribeToArenaUpdates(this.arenaId);
      } else {
        this.errorMessage = 'No se encontró ninguna arena con esa contraseña.';
        this.arenaInfo = null;
      }
    } catch (error) {
      this.errorMessage = 'Error al buscar la arena.';
      console.error(this.errorMessage, error);
    }
  }

  subscribeToArenaUpdates(arenaId: string) {
    if (this.arenaSubscription) {
      this.arenaSubscription.unsubscribe();
    }

    this.arenaSubscription = this.arenaService.getArenaUpdates(arenaId).subscribe(
      (arena) => {
        this.arenaInfo = arena;
        this.isReady = arena?.status === 'ready';
        console.log('Arena actualizada:', this.arenaInfo);
      },
      (error) => {
        console.error('Error al suscribirse a las actualizaciones de la arena:', error);
      }
    );
  }

  enterArena() {
    if (this.isReady && this.arenaId) {
      this.navCtrl.navigateForward(`/arena/${this.arenaId}`, {
        queryParams: { arenaId: this.arenaId },
      });
    } else {
      this.errorMessage = 'La arena aún no está lista.';
    }
  }
}
