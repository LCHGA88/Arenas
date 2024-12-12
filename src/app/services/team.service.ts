import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {}

  // Verificar y crear el documento del usuario con un equipo vacío
  async initializeUserTeam() {
    try {
      const user = await this.afAuth.currentUser; // Obtener usuario autenticado
      if (!user) throw new Error('Usuario no autenticado');

      const userDocRef = this.firestore.collection('users').doc(user.uid);

      // Verificar si el documento del usuario ya existe
      const docSnapshot = await userDocRef.get().pipe(take(1)).toPromise(); // Obtener el documento una vez

      if (!docSnapshot?.exists) {
        // Crear documento del usuario con una subcolección vacía
        await userDocRef.set({ createdAt: new Date() });
        console.log('Documento del usuario creado con un equipo vacío.');
      } else {
        console.log('Documento del usuario ya existe.');
      }
    } catch (error) {
      console.error('Error al inicializar el equipo del usuario:', error);
    }
  }

  // Agregar un Pokémon al equipo del usuario
// Agregar un Pokémon al equipo del usuario
async addPokemonToTeam(pokemon: { name: string; image: string }) {
  try {
    const user = await this.afAuth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    // Verificar el tamaño actual del equipo
    const teamCollectionRef = this.firestore
      .collection('users')
      .doc(user.uid)
      .collection('team');
    
    const teamSnapshot = await teamCollectionRef.get().toPromise();
    const currentTeamSize = teamSnapshot?.size || 0;

    if (currentTeamSize >= 6) {
      throw new Error('El equipo ya tiene el máximo de 6 Pokémon.');
    }

    // Obtener datos adicionales del Pokémon desde la API
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name.toLowerCase()}`);
    const data = await response.json();

    // Nivel fijo
    const level = 50;

    // Calcular HP
    const baseHp = data.stats.find((stat: any) => stat.stat.name === 'hp').base_stat;
    const hp = Math.floor(((baseHp * 2 + 31 + (0 / 4)) * level) / 100) + level + 10;

    // Calcular otros stats
    const stats = data.stats.map((stat: any) => {
      const baseStat = stat.base_stat;
      const statName = stat.stat.name;
      const calculatedStat = Math.floor(((baseStat * 2 + 31 + (0 / 4)) * level) / 100) + 5;

      return { name: statName, value: calculatedStat };
    });

    // Agregar los datos completos al equipo con el número de posición
    const position = currentTeamSize + 1; // Determinar la posición del Pokémon
    await teamCollectionRef.add({
      name: pokemon.name,
      image: pokemon.image,
      hp: hp,
      stats: stats, // Agregar todos los stats
      level: level, // Guardar el nivel
      position: position, // Asignar la posición del Pokémon en el equipo
    });

    console.log(
      `${pokemon.name} agregado al equipo en la posición ${position} con ${hp} HP y nivel ${level}.`
    );
  } catch (error) {
    console.error('Error al agregar el Pokémon al equipo:', error);
    throw error;
  }
}

  
  // Obtener el equipo del usuario actual
  getUserTeam(): Observable<any[]> {
    return new Observable((observer) => {
      this.afAuth.currentUser.then((user) => {
        if (!user) {
          observer.error('Usuario no autenticado');
          return;
        }
  
        const teamCollection = this.firestore
          .collection('users')
          .doc(user.uid)
          .collection('team');
  
        // Incluir el campo 'hp' al recuperar los datos
        teamCollection.snapshotChanges().subscribe(
          (actions) => {
            const team = actions.map((action) => {
              const data = action.payload.doc.data() as any;
              const id = action.payload.doc.id;
              return { id, ...data }; // Retornar todos los campos, incluyendo 'hp'
            });
            observer.next(team);
          },
          (error) => observer.error(error)
        );
      });
    });
  }

  // Obtener un Pokémon por su ID
// Obtener un Pokémon por su ID
// Obtener un Pokémon por su ID
async getPokemonById(pokemonId: string): Promise<any> {
  const user = await this.afAuth.currentUser;
  if (!user) throw new Error('Usuario no autenticado');

  const pokemonDoc = await this.firestore
    .collection('users')
    .doc(user.uid)
    .collection('team')
    .doc(pokemonId)
    .get()
    .pipe(take(1))
    .toPromise();

  return { id: pokemonDoc?.id, ...pokemonDoc?.data() };
}
  

// Actualizar los movimientos de un Pokémon
async updatePokemonMoves(pokemonId: string, moves: string[]): Promise<void> {
  const user = await this.afAuth.currentUser;
  if (!user) throw new Error('Usuario no autenticado');

  await this.firestore
    .collection('users')
    .doc(user.uid)
    .collection('team')
    .doc(pokemonId)
    .update({ moves });
}

async getPokemonMoves(pokemonName: string): Promise<{ name: string }[]> {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
    const data = await response.json();

    // Extraer los ataques y retornar sus nombres
    const moves = data.moves.map((move: any) => ({
      name: move.move.name,
    }));

    return moves;
  } catch (error) {
    console.error('Error al obtener los ataques del Pokémon:', error);
    throw new Error('No se pudieron obtener los ataques del Pokémon.');
  }
}

async removePokemonFromTeam(pokemonId: string) {
  try {
    const user = await this.afAuth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    const teamCollection = this.firestore
      .collection('users')
      .doc(user.uid)
      .collection('team');

    // Usar el ID correcto del documento
    await teamCollection.doc(pokemonId).delete();
    console.log(`Pokémon con ID ${pokemonId} eliminado del equipo.`);
  } catch (error) {
    console.error('Error al eliminar el Pokémon del equipo:', error);
    throw error;
  }
}

}
