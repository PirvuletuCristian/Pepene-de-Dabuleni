export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable('admin_users', {
    id: { type: 'serial', primaryKey: true },
    username: { type: 'varchar(255)', notNull: true, unique: true },
    password_hash: { type: 'varchar(255)', notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('NOW()') },
  });
};

export const down = (pgm) => {
  pgm.dropTable('admin_users');
};
