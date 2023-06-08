INSERT IGNORE INTO roles(id, name) VALUES(1, 'ROLE_BORROWER');
INSERT IGNORE INTO roles(id, name) VALUES(2, 'ROLE_ADMIN');
INSERT IGNORE INTO roles(id, name) VALUES(3, 'ROLE_GOP');

INSERT IGNORE INTO users
  (id, username, password, first_name, last_name, contact_number, enabled, verification_token)
VALUES
  (0, 'admin@corppass.com', '$argon2id$v=19$m=4096,t=3,p=1$YVmRHSHoay0bbuOyMDGAFg$xcOlM2nHtZLSJzl23fG+F3YVVgsQ0tIYQbvg0fh3L5c', 'Super', 'Admin', null, 'true', null),
  (1, 'borrower@corppass.com', '$argon2id$v=19$m=4096,t=3,p=1$YVmRHSHoay0bbuOyMDGAFg$xcOlM2nHtZLSJzl23fG+F3YVVgsQ0tIYQbvg0fh3L5c', 'Noob', 'Borrower', null, 'true', null),
  (2, 'gop@corppass.com', '$argon2id$v=19$m=4096,t=3,p=1$YVmRHSHoay0bbuOyMDGAFg$xcOlM2nHtZLSJzl23fG+F3YVVgsQ0tIYQbvg0fh3L5c', 'Good Guy', 'GOP', null, 'true', null);

INSERT IGNORE INTO user_roles
  (user_id, role_id)
VALUES
  (0, 1),
  (0, 2),
  (0, 3),
  (1, 1),
  (2, 3);

INSERT IGNORE INTO system_settings
  (id, setting_name, value)
VALUES
  (0, "passesPerLoan", "2"),
  (1, "loansPerMonth", "2");