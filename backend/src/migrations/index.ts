import * as migration_20260226_221356 from './20260226_221356';
import * as migration_20260226_221818 from './20260226_221818';

export const migrations = [
  {
    up: migration_20260226_221356.up,
    down: migration_20260226_221356.down,
    name: '20260226_221356',
  },
  {
    up: migration_20260226_221818.up,
    down: migration_20260226_221818.down,
    name: '20260226_221818'
  },
];
