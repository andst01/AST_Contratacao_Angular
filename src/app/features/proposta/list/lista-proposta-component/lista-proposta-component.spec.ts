import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPropostaComponent } from './lista-proposta-component';

describe('ListaPropostaComponent', () => {
  let component: ListaPropostaComponent;
  let fixture: ComponentFixture<ListaPropostaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaPropostaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaPropostaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
