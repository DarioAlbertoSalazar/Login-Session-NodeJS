const sequelize = require("./sequelize_conn.js");
const { DataTypes, Model } = require("sequelize");

class LoginForm extends Model {}

LoginForm.init(
  {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "LoginForm",
    tableName: "LoginForm",
  }
);

module.exports = LoginForm;
