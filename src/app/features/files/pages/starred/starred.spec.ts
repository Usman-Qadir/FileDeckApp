import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Starred } from './starred';

describe('Starred', () => {
  let component: Starred;
  let fixture: ComponentFixture<Starred>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Starred]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Starred);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
