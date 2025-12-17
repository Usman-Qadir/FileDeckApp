import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recent } from './recent';

describe('Recent', () => {
  let component: Recent;
  let fixture: ComponentFixture<Recent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Recent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
