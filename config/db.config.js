module.exports = {
  HOST: 'localhost',
  USER: 'root',
  PASSWORD: 'dacduy2005',
  DB: 'student_forum',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};