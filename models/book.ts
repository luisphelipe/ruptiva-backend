const { Model } = require("sequelize");

export default (sequelize, DataTypes) => {
  class Book extends Model {
    public id!: number;
    public image_url!: string;
    public review!: string;
    public rating!: number;

    static associate(models) {
      Book.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }

  Book.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image_url: DataTypes.STRING,
      review: DataTypes.TEXT,
      rating: DataTypes.INTEGER,
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Book",
    }
  );

  return Book;
};
