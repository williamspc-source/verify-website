import * as migration_20260823_130006_baseline from './20260823_130006_baseline';
import * as migration_20260824_122116_editor_controls_enums from './20260824_122116_editor_controls_enums';
import * as migration_20260824_122117_editor_controls from './20260824_122117_editor_controls';

export const migrations = [
  {
    up: migration_20260823_130006_baseline.up,
    down: migration_20260823_130006_baseline.down,
    name: '20260823_130006_baseline',
  },
  {
    up: migration_20260824_122116_editor_controls_enums.up,
    down: migration_20260824_122116_editor_controls_enums.down,
    name: '20260824_122116_editor_controls_enums',
  },
  {
    up: migration_20260824_122117_editor_controls.up,
    down: migration_20260824_122117_editor_controls.down,
    name: '20260824_122117_editor_controls'
  },
];
