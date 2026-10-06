import * as migration_20260825_130820_fresh_baseline from './20260825_130820_fresh_baseline';
import * as migration_20261006_122247_add_reset_password_requested_at from './20261006_122247_add_reset_password_requested_at';

export const migrations = [
  {
    up: migration_20260825_130820_fresh_baseline.up,
    down: migration_20260825_130820_fresh_baseline.down,
    name: '20260825_130820_fresh_baseline',
  },
  {
    up: migration_20261006_122247_add_reset_password_requested_at.up,
    down: migration_20261006_122247_add_reset_password_requested_at.down,
    name: '20261006_122247_add_reset_password_requested_at'
  },
];
