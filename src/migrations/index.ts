import * as migration_20260823_130006_baseline from './20260823_130006_baseline';

export const migrations = [
  {
    up: migration_20260823_130006_baseline.up,
    down: migration_20260823_130006_baseline.down,
    name: '20260823_130006_baseline'
  },
];
