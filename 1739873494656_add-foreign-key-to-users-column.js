exports.shorthands = undefined;

exports.up = (pgm) => {
  // membuat user baru.
  pgm.sql("INSERT INTO users(id, username, password, fullname) VALUES ('old_playlists', 'old_playlists', 'old_playlists', 'old playlists')");

  // mengubah nilai user pada playlist yang users-nya bernilai NULL
  pgm.sql("UPDATE playlists SET users = 'old_playlists' WHERE users IS NULL");

  // memberikan constraint foreign key pada users terhadap kolom id dari tabel playlist
  pgm.addConstraint('playlists', 'fk_playlists.owner_users.id', 'FOREIGN KEY(users) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // menghapus constraint fk_playlists.owner_users.id pada tabel playlists
  pgm.dropConstraint('playlists', 'fk_playlists.owner_users.id');

  // mengubah nilai owner old_playlists pada playlist menjadi NULL
  pgm.sql("UPDATE playlists SET owner = NULL WHERE owner = 'old_playlists'");

  // menghapus user baru.
  pgm.sql("DELETE FROM users WHERE id = 'old_playlists'");
};
