import { Component, OnInit } from '@angular/core';
import { TeamService } from '../services/team.service';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  team: {
    id: string;
    name: string;
    image: string;
    hp: number;
    level: number;
    stats: { name: string; value: number }[];
    position: number;
  }[] = []; // Agregamos el campo `position`

  constructor(
    private teamService: TeamService,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.loadUserTeam();
  }

  // Cargar el equipo del usuario
  loadUserTeam() {
    this.teamService.getUserTeam().subscribe(
      (data) => {
        this.team = data
          .map((pokemon) => ({
            id: pokemon.id,
            name: pokemon.name,
            image: pokemon.image,
            hp: pokemon.hp,
            level: pokemon.level || 50, // Nivel predeterminado
            stats: pokemon.stats || [], // Estadísticas predeterminadas
            position: pokemon.position || 1, // Posición predeterminada
          }))
          .sort((a, b) => a.position - b.position); // Ordenar por posición
      },
      (error) => {
        console.error('Error al cargar el equipo del usuario:', error);
      }
    );
  }

  // Redirigir a tab3 con el Pokémon seleccionado
  editPokemon(pokemon: any) {
    this.navCtrl.navigateForward(`/tabs/tab3`, {
      queryParams: { id: pokemon.id },
    });
  }

  // Eliminar Pokémon del equipo
  async removeFromTeam(pokemonId: string) {
    try {
      await this.teamService.removePokemonFromTeam(pokemonId);
      this.showAlert('Éxito', 'Pokémon eliminado del equipo.');
      this.loadUserTeam(); // Recargar el equipo después de eliminar
    } catch (error) {
      this.showAlert('Error', 'No se pudo eliminar el Pokémon.');
    }
  }

  // Mostrar alerta
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
