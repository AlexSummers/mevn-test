module.exports = {
  DB: process.env.MONGO_URL ? process.env.MONGO_URL : 'mongodb://localhost:27017/mevn_main_db',
  APP_PORT: process.env.APP_PORT ? process.env.APP_PORT : 80,
};
