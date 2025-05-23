const { Sequelize } = require('sequelize');
const dbConfig = require('../../config/db.config');

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
    logging: false // Tắt log SQL
  }
);

const connection=async()=>{
    try{
        await sequelize.authenticate();
        console.log('success connection db')
    }catch(error){
        console.log("loi" , error)
    }
}

// Import models
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user.model')(sequelize, Sequelize);
db.Group= require('./groups.model')(sequelize, Sequelize);
db.GroupMember = require('./group_members.model')(sequelize,Sequelize)
db.Post= require('./posts.model')(sequelize,Sequelize)
db.Comment = require('./comment.model')(sequelize, Sequelize)

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
connection()
module.exports = db;
