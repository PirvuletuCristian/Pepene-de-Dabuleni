/* eslint-disable @typescript-eslint/quotes */
export const shorthands = undefined;

export const up = (pgm) => {
  pgm.sql(`
    INSERT INTO producers (name, product, location)
    VALUES ('Gita', 'Sorento', ST_SetSRID(ST_MakePoint(21.2272, 45.7494), 4326));
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DELETE FROM producers WHERE name = 'Gita' AND product = 'Sorento';
  `);
};
