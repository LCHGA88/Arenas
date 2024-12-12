import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TeamService } from '../services/team.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  pokemonList: { name: string; image: string }[] = []; // Lista de Pokémon
  isDataLoaded = false;

  constructor(private http: HttpClient, private teamService: TeamService) {}

  ngOnInit() {
    if (!this.isDataLoaded) {
      this.fetchAllPokemonData();
    }
  }

  async fetchAllPokemonData() {
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=200&offset=0';

    try {
      while (apiUrl) {
        const response: any = await this.http.get(apiUrl).toPromise();
        const results = response.results;

        for (const pokemon of results) {
          const details: any = await this.http.get(pokemon.url).toPromise();
          const name = this.capitalizeFirstLetter(details.name);
          const image = details.sprites.front_default;

          this.pokemonList.push({ name, image });
        }

        apiUrl = response.next;
      }

      this.isDataLoaded = true;
    } catch (error) {
      console.error('Error al obtener los datos de los Pokémon:', error);
    }
  }

  capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  // Agregar Pokémon al equipo
  async addToTeam(pokemon: { name: string; image: string }) {
    await this.teamService.addPokemonToTeam(pokemon);
  }
}
