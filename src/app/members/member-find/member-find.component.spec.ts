import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberFindComponent } from './member-find.component';

describe('MemberFindComponent', () => {
  let component: MemberFindComponent;
  let fixture: ComponentFixture<MemberFindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberFindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
