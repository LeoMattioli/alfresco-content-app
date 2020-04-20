import { TestBed } from '@angular/core/testing';

import { IncompleteDocsService } from './incomplete-docs.service';

describe('IncompleteDocsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IncompleteDocsService = TestBed.get(IncompleteDocsService);
    expect(service).toBeTruthy();
  });
});
