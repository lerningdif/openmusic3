const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { Pool } = require('pg');
const { mapAlbumToDBModel } = require('../../utils');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

     const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }
 
    return result.rows[0].id;
  }

  async getAlbums(id) {
    const query = {
      text: 'SELECT id, name, year FROM albums WHERE id = $1',
      values: [id],
    };
     const result = await this._pool.query('SELECT * FROM albums');
return result.rows.map(mapAlbumToDBModel);
  }

  async getAlbumById(id) {
    const query = {
        text: `
            SELECT 
                albums.id, 
                albums.name, 
                albums.year,
                albums."coverUrl"
            FROM albums 
            WHERE albums.id = $1
        `,
        values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    const album = result.rows[0 ]
    const songQuery = {
      text: `SELECT id, title, performer FROM songs WHERE "albumId" =  $1`,
      values: [id]
    }
    const songResult = await this._pool.query(songQuery);
    const songs = songResult.rows.map(mapAlbumToDBModel)
    return {
      ...album,
      songs
    };
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3',
      values: [name, year, id],
    };


    const result = await this._pool.query(query);


    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async editAlbumCoverById(id, coverUrl) { 
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET "coverUrl" = $1 WHERE id = $2',
      values: [coverUrl, id],
    };
    const result = await this._pool.query(query);


    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui cover. Id tidak ditemukan');
    }
  }
  
  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}



module.exports = AlbumsService;
