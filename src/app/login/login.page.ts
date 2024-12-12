import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TeamService } from '../services/team.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  usuario: string = ''; // Email del usuario
  pass: string = '';    // Contraseña del usuario

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router,
    private teamService: TeamService,
  ) {}

  async iniciarSesion() {
    try {
      const user = await this.authService.login(this.usuario, this.pass);
      console.log('Login exitoso:', user);
  
      // Inicializar el equipo del usuario en Firebase
      await this.teamService.initializeUserTeam();
  
      // Navegar a la página principal
      this.router.navigate(['/tabs/tab1']); // Cambia la ruta según la estructura de tu app
    } catch (error) {
      console.error('Error en el login:', error);
      this.presentAlert('Error de Login', 'Usuario o contraseña incorrectos.');
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

  registrar(){
    this.router.navigate(['/register']);
  }
}
