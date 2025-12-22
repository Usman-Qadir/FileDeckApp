import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFiles } from './my-files';

describe('MyFiles', () => {
  let component: MyFiles;
  let fixture: ComponentFixture<MyFiles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyFiles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyFiles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
