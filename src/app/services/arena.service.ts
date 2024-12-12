import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArenaService {
  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {}

  async createArena(arenaName: string, password: string, team: any[]) {
    try {
      const user = await this.afAuth.currentUser;
      if (!user) throw new Error('Usuario no autenticado');

      const userDocRef = this.firestore.collection('users').doc(user.uid);
      const userDoc = await userDocRef.get().toPromise();
      const userName = (userDoc?.data() as any)?.displayName || 'Jugador Anónimo';

      // Agregar movimientos a cada Pokémon del equipo
      const enrichedTeam = await this.enrichTeamWithMoves(team);

      const arena = {
        arenaName,
        password,
        player1: userName,
        player2: null,
        team1: enrichedTeam,
        team2: null,
        createdAt: new Date(),
        status: 'waiting',
      };

      const docRef = await this.firestore.collection('arenas').add(arena);
      console.log('Arena creada:', { id: docRef.id, ...arena });
      return { id: docRef.id, ...arena };
    } catch (error) {
      console.error('Error al crear la arena:', error);
      throw error;
    }
  }

  async searchArena(password: string, team: any[]) {
    try {
      const querySnapshot = await this.firestore
        .collection('arenas', (ref) => ref.where('password', '==', password))
        .get()
        .toPromise();

      if (querySnapshot && !querySnapshot.empty) {
        const arenaDoc = querySnapshot.docs[0];
        const arenaData = arenaDoc.data() as any;

        const user = await this.afAuth.currentUser;
        if (!user) throw new Error('Usuario no autenticado');

        const userDocRef = this.firestore.collection('users').doc(user.uid);
        const userDoc = await userDocRef.get().toPromise();
        const userName = (userDoc?.data() as any)?.displayName || 'Jugador Anónimo';

        // Agregar movimientos a cada Pokémon del equipo
        const enrichedTeam = await this.enrichTeamWithMoves(team);

        // Actualizar la arena con el jugador 2 y su equipo
        await this.firestore.collection('arenas').doc(arenaDoc.id).update({
          player2: userName,
          team2: enrichedTeam,
          status: 'ready',
        });

        console.log('Jugador 2 unido a la arena:', { id: arenaDoc.id, ...arenaData, player2: userName });
        return { id: arenaDoc.id, ...arenaData, player2: userName };
      }

      return null;
    } catch (error) {
      console.error('Error al buscar o unirse a la arena:', error);
      throw error;
    }
  }

  getArenaUpdates(arenaId: string): Observable<any> {
    return this.firestore.collection('arenas').doc(arenaId).valueChanges();
  }

  private async enrichTeamWithMoves(team: any[]) {
    const enrichedTeam = await Promise.all(
      team.map(async (pokemon) => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name.toLowerCase()}`);
        const data = await response.json();

        // Tomar los primeros 4 movimientos
        const moves = data.moves.slice(0, 4).map((move: any) => move.move.name);

        return {
          ...pokemon,
          moves, // Agregar movimientos
        };
      })
    );
    return enrichedTeam;
  }
}
