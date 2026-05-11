export const shorthands = undefined;

export const up = (pgm) => {
  // Default admin user: admin / admin123 (change password after first login)
  pgm.sql(`
    INSERT INTO admin_users (username, password_hash)
    VALUES ('admin', '$2b$10$mKnQQng.ScpYPZfF9J4kbu4HAk87P1Zb4TWY.wOsIHHTkjhATZJ06')
    ON CONFLICT (username) DO NOTHING;
  `);
};

export const down = (pgm) => {
  pgm.sql("DELETE FROM admin_users WHERE username = 'admin';");
};
