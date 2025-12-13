import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Myfile } from './myfile';

describe('Myfile', () => {
  let component: Myfile;
  let fixture: ComponentFixture<Myfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Myfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Myfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
