import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfieldChecklist} from './InfieldChecklist';

describe('InfieldChecklistPage', () => {
  let component: InfieldChecklist;
  let fixture: ComponentFixture<InfieldChecklist>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InfieldChecklist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
