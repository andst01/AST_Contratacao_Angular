import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaApoliceComponent } from './lista-apolice-component';

describe('ListaApoliceComponent', () => {
  let component: ListaApoliceComponent;
  let fixture: ComponentFixture<ListaApoliceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaApoliceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaApoliceComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
