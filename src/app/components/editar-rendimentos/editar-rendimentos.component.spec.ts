import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarRendimentosComponent } from './editar-rendimentos.component';

describe('EditarRendimentosComponent', () => {
  let component: EditarRendimentosComponent;
  let fixture: ComponentFixture<EditarRendimentosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarRendimentosComponent]
    });
    fixture = TestBed.createComponent(EditarRendimentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
