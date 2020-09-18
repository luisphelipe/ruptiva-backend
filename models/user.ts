const { Model } = require("sequelize");

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}
    public id!: number;
    public email!: number;
    public password!: number;
  }

  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};
