const Joi = require('joi');
 
const User_album_likePayloadSchema = Joi.object({
  albumId: Joi.string().required(),
});
 
module.exports = { User_album_likePayloadSchema };