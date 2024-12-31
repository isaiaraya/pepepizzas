import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcompanamientosPage } from './acompanamientos.page';

describe('AcompanamientosPage', () => {
  let component: AcompanamientosPage;
  let fixture: ComponentFixture<AcompanamientosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AcompanamientosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
