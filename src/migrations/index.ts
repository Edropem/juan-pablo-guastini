import * as migration_20260409_155706_initial from './20260409_155706_initial';
import * as migration_20260731_211616_portfolio_schema from './20260731_211616_portfolio_schema';

export const migrations = [
  {
    up: migration_20260409_155706_initial.up,
    down: migration_20260409_155706_initial.down,
    name: '20260409_155706_initial',
  },
  {
    up: migration_20260731_211616_portfolio_schema.up,
    down: migration_20260731_211616_portfolio_schema.down,
    name: '20260731_211616_portfolio_schema'
  },
];
