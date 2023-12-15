'use strict'
const { Op } = require('sequelize')
const { Model } = require('sequelize')
const formattedDate = (d) => {
  return d.toISOString().split('T')[0]
}
const dateToday = new Date()
const today = formattedDate(dateToday)
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTask (params) {
      return await Todo.create(params)
    }

    static async showList () {
      console.log('My Todo list \n')
      console.log('Overdue')
      const obj1 = await Todo.overdue()
      const overlist = obj1.map((t) => t.displayableString())
      for (let i = 0; i < overlist.length; i++) {
        console.log(overlist[i])
      }
      console.log('\n')

      console.log('Due Today')

      const obj2 = await Todo.dueToday()
      const duetodaylist = obj2.map((t) => t.displayableString())
      for (let i = 0; i < duetodaylist.length; i++) {
        console.log(duetodaylist[i])
      }

      console.log('\n')

      console.log('Due Later')

      const obj3 = await Todo.dueLater()
      const duelaterlist = obj3.map((t) => t.displayableString())
      for (let i = 0; i < duelaterlist.length; i++) {
        console.log(duelaterlist[i])
      }
    }

    static async overdue () {
      const todo = await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: today
          }
        }
      })
      return todo
    }

    static async dueToday () {
      const todo = await Todo.findAll({
        where: {
          dueDate: today
        }
      })
      return todo
    }

    static async dueLater () {
      const todo = await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: today
          }
        }
      })
      return todo
    }

    static async markAsComplete (id) {
      await Todo.update(
        { completed: true },
        {
          where: {
            id
          }
        }
      )
    }

    displayableString () {
      const checkbox = this.completed ? '[x]' : '[ ]'
      if (this.dueDate === today) {
        return `${this.id}. ${checkbox} ${this.title}`
      }
      return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`
    }
  }

  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: 'Todo'
    }
  )
  return Todo
}
