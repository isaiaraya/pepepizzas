import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EncuentranosPage } from './encuentranos.page';

describe('EncuentranosPage', () => {
  let component: EncuentranosPage;
  let fixture: ComponentFixture<EncuentranosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EncuentranosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
