import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyView } from './empty-view';

describe('EmptyView', () => {
  let component: EmptyView;
  let fixture: ComponentFixture<EmptyView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
