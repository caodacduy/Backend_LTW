module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define('Vote', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    target_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    target_type: {
      type: DataTypes.ENUM('post', 'comment'),
      allowNull: false
    },
    value: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        isIn: [[-1, 1]]
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'votes',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'target_id', 'target_type']
      }
    ]
  });

  Vote.associate = (models) => {
    Vote.belongsTo(models.User, { foreignKey: 'user_id' });

    // Optional: Nếu bạn muốn xử lý association nâng cao giữa post/comment và vote
    // thì phải dùng thủ thuật "polymorphic" (phức tạp hơn).
  };

  return Vote;
};
