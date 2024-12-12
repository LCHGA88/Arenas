import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabPerfilPage } from './tab-perfil.page';

describe('TabPerfilPage', () => {
  let component: TabPerfilPage;
  let fixture: ComponentFixture<TabPerfilPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabPerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
