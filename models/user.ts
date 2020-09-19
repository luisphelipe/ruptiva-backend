import { Model } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}
    public id!: number;
    public email!: string;
    public password!: string;
    public verifyPassword!: (p: string) => Promise<boolean>;
    public generateAuthToken!: () => string;
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
      hooks: {
        beforeSave: async (user) => {
          user.password = await bcrypt.hash(user.password, 10);
        },
      },
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
    }
  );

  User.prototype.verifyPassword = async function (password) {
    const compare = await bcrypt.compare(password, this.password);
    return compare;
  };

  User.prototype.generateAuthToken = function () {
    const token = jwt.sign(
      { id: this.id, username: this.username },
      process.env.PRIVATE_KEY
    );
    return token;
  };

  return User;
};
