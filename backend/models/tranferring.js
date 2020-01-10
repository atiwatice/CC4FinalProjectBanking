module.exports = (sequelize, DataTypes) => {
  const tranferring = sequelize.define(
    "tranferring",
    {
      uid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      type: {
        type: DataTypes.STRING(100)
      },
      amount: {
        type: DataTypes.FLOAT(2)
      },
      detail: {
        type: DataTypes.STRING(500)
      },
      from_to: {
        type: DataTypes.STRING(100)
      }
    },
    { timestamps: true }
  );

  return tranferring;
};
