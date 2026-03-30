import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApoliceFormComponent } from './apolice-form-component';

describe('ApoliceFormComponent', () => {
  let component: ApoliceFormComponent;
  let fixture: ComponentFixture<ApoliceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApoliceFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApoliceFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
