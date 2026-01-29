import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTaskListComponent } from './admin-task-list.component';

describe('AdminTaskListComponent', () => {
  let component: AdminTaskListComponent;
  let fixture: ComponentFixture<AdminTaskListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTaskListComponent]
    });
    fixture = TestBed.createComponent(AdminTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
