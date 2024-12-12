import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamService } from '../services/team.service';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  pokemon: any = null; // Almacena la información del Pokémon
  availableMoves: string[] = []; // Lista de ataques disponibles
  selectedMoves: string[] = ['', '', '', '']; // Ataques seleccionados

  constructor(
    private route: ActivatedRoute,
    private teamService: TeamService
  ) {}

  ngOnInit() {
    const pokemonId = this.route.snapshot.paramMap.get('id');
    if (pokemonId) {
      this.loadPokemonData(pokemonId);
    }
  }

  async loadPokemonData(pokemonId: string) {
    try {
      // Obtener los datos del Pokémon desde Firebase
      const pokemonData = await this.teamService.getPokemonById(pokemonId);
      this.pokemon = pokemonData;

      // Pre-cargar movimientos si ya existen
      this.selectedMoves = pokemonData.moves || ['', '', '', ''];

      // Obtener movimientos disponibles desde la API de Pokémon
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${this.pokemon.name.toLowerCase()}`);
      const data = await response.json();

      // Filtrar los movimientos disponibles
      this.availableMoves = data.moves.map((move: any) => move.move.name);
    } catch (error) {
      console.error('Error al cargar los datos del Pokémon:', error);
    }
  }

  async saveMoves() {
    if (this.selectedMoves.some((move) => !move)) {
      alert('Debes seleccionar 4 movimientos.');
      return;
    }

    try {
      await this.teamService.updatePokemonMoves(this.pokemon.id, this.selectedMoves);
      alert('Ataques guardados correctamente.');
    } catch (error) {
      console.error('Error al guardar los ataques:', error);
      alert('Ocurrió un error al guardar los ataques.');
    }
  }
}
