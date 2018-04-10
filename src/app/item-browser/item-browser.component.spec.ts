import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemBrowserComponent } from './item-browser.component';

describe('ItemBrowserComponent', () => {
  let component: ItemBrowserComponent;
  let fixture: ComponentFixture<ItemBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemBrowserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
