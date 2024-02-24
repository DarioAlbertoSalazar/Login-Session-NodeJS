const sequelize = require("./sequelize_conn.js");
const { DataTypes, Model } = require("sequelize");

class Task extends Model {}

Task.init(
  {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    loginFormId: DataTypes.INTEGER
  },
  {
    sequelize,
    modelName: "Task",
    tableName: "Task",
  }
);

module.exports = Task;
