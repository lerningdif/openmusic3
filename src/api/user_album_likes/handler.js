const ClientError = require('../../exceptions/ClientError');
 
class User_album_likesHandler {
  constructor(user_album_likesService, playlistsService, validator) {
    this._user_album_likesService = user_album_likesService;
    this._playlistsService = playlistsService;
    this._validator = validator;
 
 
    this.postUser_album_likeHandler = this.postUser_album_likeHandler.bind(this);
    this.getUser_album_likesHandler = this.getUser_album_likesHandler.bind(this);
    this.deleteUser_album_likeByIdHandler = this.deleteUser_album_likeByIdHandler.bind(this);
  }
 
  async postUser_album_likeHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const response = h.response({
      status: 'success',
      message: 'Menyukai album',
    });
    response.code(201);
    return response;
  } 
  async getUser_album_likesHandler(request,h) {
    const { id } = request.params;
 
     const response = h.response({
       status: 'success',
       data: {
         likes: result,
       },
     });
     if (isCache) {
       response.header('X-Data-Source', 'cache');
     } else {
       response.header('X-Data-Source', 'not-cache');
     }
     return response;
   }
 
  
async deleteUser_album_likeByIdHandler(request, h) {
 
  const { id } = request.params;
  const { id: credentialId } = request.auth.credentials;

  return {
    status: 'success',
    message: 'Batal menyukai album',
  };
}
}

 
module.exports = User_album_likesHandler;
