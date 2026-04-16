/* eslint-disable @typescript-eslint/quotes */
export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable('producers', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    name: {
      type: 'varchar(255)',
      notNull: true,
    },
    product: {
      type: 'varchar(255)',
      notNull: true,
    },
    location: {
      type: 'geometry(Point, 4326)',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      default: pgm.func('NOW()'),
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('producers');
};
