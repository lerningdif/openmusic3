require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');
const ClientError = require('./exceptions/ClientError');

// albums
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumsValidator = require('./validator/albums');

// songs
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsServices');
const SongsValidator = require('./validator/songs');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// playlists
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');

// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

// playlist_songs
const playlist_songs = require('./api/playlist_songs');
const Playlist_songsService = require('./services/postgres/Playlist_songsService');
const Playlist_songsValidator = require('./validator/playlist_songs');

// Exports
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

// uploads
const uploads = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads');

// user_album_likes

const user_album_likes = require('./api/user_album_likes');
const User_album_likesService = require('./services/postgres/User_album_likesService');
const User_album_likesValidator = require('./validator/user_album_likes');


// cache
const CacheService = require('./services/redis/CacheService');

const init = async () => {

  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService ();
  const collaborationsService = new CollaborationsService();
  const playlist_songsService = new Playlist_songsService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));
  const user_album_likesService = new User_album_likesService ();
  const cacheService = new CacheService();


  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);
 
  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('openmusicapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });
 
  await server.register([
    {
    plugin: albums,
    options: {
    service: albumsService,
    validator: AlbumsValidator,
    },
  },
{
    plugin: songs,
    options:{
      service: songsService,
      validator: SongsValidator,
    },
  },
  {
    plugin: users,
    options: {
      service: usersService,
      validator: UsersValidator,
    },
  },
  {
    plugin: authentications,
    options: {
      authenticationsService,
      usersService,
      tokenManager: TokenManager,
      validator: AuthenticationsValidator,
    },
  },
  {
    plugin: playlists,
    options:{
      service: playlistsService,
      validator: PlaylistsValidator,
    },
  },
  {
    plugin: collaborations,
    options: {
      service: collaborationsService,
      validator: CollaborationsValidator,
    },
  },
  {
    plugin: playlist_songs,
    options:{
      playlist_songsService,
      playlistsService,
      validator: Playlist_songsValidator,
    },
  },
  {
    plugin: _exports,
    options: {
      service: ProducerService,
      playlistsService,
      validator: ExportsValidator,
    },
  },
  {
    plugin: uploads,
    options: {
      storageService,
      albumsService,
      validator: UploadsValidator,
    },
  },
  {
    plugin: user_album_likes,
    options:{
      user_album_likesService,
      playlistsService,
      validator: User_album_likesValidator,
    },
  },
]);



server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
    

    // penanganan client error secara internal.
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  })

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
