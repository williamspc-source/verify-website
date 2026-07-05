import * as migration_20260705_105320_baseline from './20260705_105320_baseline';

export const migrations = [
  {
    up: migration_20260705_105320_baseline.up,
    down: migration_20260705_105320_baseline.down,
    name: '20260705_105320_baseline'
  },
];
