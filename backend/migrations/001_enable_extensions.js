/* eslint-disable @typescript-eslint/quotes */
export const shorthands = undefined;

export const up = (pgm) => {
  pgm.sql(`
    CREATE EXTENSION IF NOT EXISTS postgis;
    CREATE EXTENSION IF NOT EXISTS postgis_topology;
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DROP EXTENSION IF EXISTS postgis_topology;
    DROP EXTENSION IF EXISTS postgis;
  `);
};
