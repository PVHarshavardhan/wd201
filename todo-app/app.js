// const { request, response } = require('express')
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const { Todo } = require("./models");
// const todo = require('./models/todo')

app.get("/todos", async (request, response) => {
  const todoItems = await Todo.getTodo();
  response.json(todoItems);
});
app.post("/todos", async (request, response) => {
  console.log("creating a todo", request.body);
  try {
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      completed: false,
    });
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
app.put("/todos/:id/markAsCompleted", async (request, response) => {
  console.log("we have to update a todo with ID:", request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
app.delete("/todos/:id", async (request, response) => {
  console.log("delete a todo by ID:", request.params.id);
  try {
    const deletedTodo = await Todo.deleteTodo(request.params.id);
    if (deletedTodo > 0) {
      return response.send(true);
    } else {
      return response.send(false);
    }
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
module.exports = app;
