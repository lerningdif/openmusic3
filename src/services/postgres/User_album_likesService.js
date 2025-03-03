const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');
 
class User_album_likesService {
   constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }
 
  async addUser_album_like({userId,albumId}) {
    const id = `user_album_like-${nanoid(16)}`;
 
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId,albumId],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }
 
    return result.rows[0].id;
  }
 
  async getUser_album_likes(userId) {
    const queryUser = {
      text: `SELECT user.id, album.name, users.username
      FROM albums
      JOIN users ON albums.owner = users.id
      WHERE albums.id = $1`,
      values: [albumId],
    };
 
    const result = await this._pool.query(queryPlaylist);
 
    if (!result.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }
 
    const queryAlbums = {
      text: `SELECT albums.id, albums.title, albums.performer
            FROM user_albums
            JOIN albums ON user_albums.album_id = albums.id
            WHERE user_albums.user_id= $1`,
      values: [userId],
    };
 
    const albumResult = await this._pool.query(queryAlbums);
 
    const albums = albumResult.rows.map((album) => ({
      id: album.id,
      title: album.title,
      performer: album.performer,
    }))
 
    const user = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        username: result.rows[0].username,
        albums: albums
    }
 
 
    return user;
  }
 
 
  async deleteUser_album_likeById(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rowCount) {
      throw new InvariantError('Batal menyukai album ');
    }
  }
 
  async verifyAlbum(albumId) {
    const query = {
      text: `SELECT id FROM albums WHERE id = $1`,
      values: [albumId]
    }
 
    const result = await this._pool.query(query)
 
    if(!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan')
    }
  }
  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const { id, password: hashedPassword } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return id;
  }
}
 
module.exports = User_album_likesService;
