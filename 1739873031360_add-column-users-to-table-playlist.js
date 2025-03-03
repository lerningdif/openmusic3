exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn('playlists', {
    users: {
      type: 'VARCHAR(50)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('playlist', 'user');
};