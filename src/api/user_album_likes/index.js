const User_album_likesHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "user_album_likes",
  version: "1.0.0",
  register: async (server, { user_album_likesService, playlistsService, validator }) => {
    const user_album_likesHandler = new User_album_likesHandler(user_album_likesService, playlistsService, validator);
    server.route(routes(user_album_likesHandler));
  },
};