import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbcrawlerComponent } from './dbcrawler.component';

describe('DbcrawlerComponent', () => {
  let component: DbcrawlerComponent;
  let fixture: ComponentFixture<DbcrawlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DbcrawlerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbcrawlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
