const ClientError = require('../../exceptions/ClientError');
 
class UploadsHandler {
  constructor(storageService, albumsService, validator) {
    this._storageService = storageService;
    this._albumsService = albumsService
    this._validator = validator;
 
    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }
 
  async postUploadImageHandler(request, h) {
    const { cover } = request.payload;
    const { id: albumId } = request.params;
    this._validator.validateImageHeaders(cover.hapi.headers);
 
    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const url = `http://${process.env.HOST}:${process.env.PORT}/uploads/images/${filename}`;
    await this._albumsService.editAlbumCoverById(albumId, url);
 
    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
      cover: {
        coverUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/covers/${filename}`,
      },
    });
    response.code(201);
    return response;
  }
}
 
module.exports = UploadsHandler;
