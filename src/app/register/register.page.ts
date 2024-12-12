import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  usuario: string = ''; // Email del usuario
  pass: string = '';    // Contraseña del usuario
  confirmPass: string = ''; // Confirmación de la contraseña

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router
  ) {}

  async registrar() {
    if (this.pass !== this.confirmPass) {
      await this.presentAlert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    try {
      const user = await this.authService.register(this.usuario, this.pass);
      console.log('Registro exitoso:', user);

      // Navegar a la página de login después del registro
      this.router.navigate(['/login']); // Cambia la ruta según la estructura de tu app
    } catch (error) {
      console.error('Error en el registro:', error);
      this.presentAlert('Error de Registro', 'No se pudo completar el registro.');
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
