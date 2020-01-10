module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      firstname: {
        type: DataTypes.STRING(100)
      },
      lastname: {
        type: DataTypes.STRING(100)
      },
      username: {
        type: DataTypes.STRING(100),
        unique:true
      },
      password: {
        type: DataTypes.STRING(500)
      },
      role: {
        type: DataTypes.ENUM("admin", "user")
      }
    },
    { timestamps: false }
  );

  user.associate = function(models) {
    user.hasMany(models.account, { foreignKey: "userid" });
    user.hasMany(models.tranferring, { foreignKey: "userid" });
  };

  return user;
};
