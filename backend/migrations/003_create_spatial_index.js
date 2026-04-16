/* eslint-disable @typescript-eslint/quotes */
export const shorthands = undefined;

export const up = (pgm) => {
  pgm.sql(`
    CREATE INDEX IF NOT EXISTS idx_producers_location ON producers USING GIST (location);
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DROP INDEX IF EXISTS idx_producers_location;
  `);
};
