import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArenaPageRoutingModule } from './arena-routing.module';

import { ArenaPage } from './arena.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArenaPageRoutingModule
  ],
  declarations: [ArenaPage]
})
export class ArenaPageModule {}
