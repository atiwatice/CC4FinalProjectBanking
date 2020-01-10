module.exports = (sequelize, DataTypes) => {
  const account = sequelize.define(
    "account",
    {
      accountNo:{
        type: DataTypes.STRING(100),
        unique:true,
        primaryKey:true
      },

      balance: {
        type: DataTypes.FLOAT(2)
      },
     
      accountType: {
        type: DataTypes.STRING(50)
      }
    },
    {
      timestamps: false
    }
  );

  account.associate = function(models) {
    
    account.hasMany(models.tranferring, { foreignKey: "accountNo" });
  };

  return account;
};
