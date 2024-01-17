"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Todo.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }

    static addTodo({ title, dueDate, userId }) {
      return this.create({ title, dueDate, completed: false, userId });
    }

    // markAsCompleted () {
    //   return this.update({ completed: true })
    // }

    setCompletionStatus(state) {
      if (state === true) {
        return this.update({
          completed: false,
        });
      } else {
        return this.update({
          completed: true,
        });
      }
    }

    static getTodos() {
      return this.findAll();
    }

    static async deleteTodo(id, userId) {
      const state = await this.destroy({ where: { id, userId } });
      // console.log('hello')
      console.log(state);
      if (state > 0) {
        return true;
      } else {
        return false;
      }
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    },
  );
  return Todo;
};
