import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-tab-perfil',
  templateUrl: './tab-perfil.page.html',
  styleUrls: ['./tab-perfil.page.scss'],
})
export class TabPerfilPage {
  displayName: string = ''; // Nombre del usuario
  message: string = ''; // Mensaje de éxito o error

  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {}

  async saveUserProfile() {
    try {
      const user = await this.afAuth.currentUser;
      if (!user) throw new Error('Usuario no autenticado');

      // Actualizar o crear el perfil del usuario
      const userDocRef = this.firestore.collection('users').doc(user.uid);
      await userDocRef.set(
        { displayName: this.displayName, uid: user.uid },
        { merge: true } // Combina con los datos existentes
      );

      this.message = 'Perfil actualizado correctamente.';
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
      this.message = 'Error al guardar el perfil. Intenta nuevamente.';
    }
  }
}
