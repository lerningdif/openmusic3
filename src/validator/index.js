const InvariantError = require('../../exceptions/InvariantError');
const { User_album_likePayloadSchema } = require('./schema');
 
const User_album_likesValidator = {
  validateUser_album_likePayload: (payload) => {
    const validationResult = User_album_likePayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
 
module.exports = User_album_likesValidator;