import { AbilitiesGuard } from './abilities.guard.js';

describe('AbilitiesGuard', () => {
  it('should be defined', () => {
    expect(new AbilitiesGuard({} as any, {} as any)).toBeDefined();
  });
});
