const sequelize = require("./sequelize_conn.js");
const { DataTypes, Model } = require("sequelize");

class User extends Model {}

User.init(
  {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "User",
    tableName: "User",
  }
);

module.exports = User;
