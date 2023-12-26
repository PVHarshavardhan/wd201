// const { request, response } = require('express')
const express = require("express");
const csrf = require("tiny-csrf");
const cookieParser = require("cookie-parser");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));
const path = require("path");

const { Todo } = require("./models");
// const todo = require('./models/todo')
app.set("view engine", "ejs");
app.get("/", async (request, response) => {
  const allTodos = await Todo.getTodos();
  if (request.accepts("html")) {
    response.render("index", {
      allTodos,
      title: "Todoapplication",
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json({
      allTodos,
    });
  }
});
app.use(express.static(path.join(__dirname, "public")));
app.get("/todos", async (request, response) => {
  const todoItems = await Todo.getTodos();
  response.json(todoItems);
});
app.post("/todos", async (request, response) => {
  console.log("creating a todo", request.body);
  try {
    if (request.body.title != null || request.body.title != null) {
      await Todo.addTodo({
        title: request.body.title,
        dueDate: request.body.dueDate,
      });
    }
    return response.redirect("/");
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

app.put("/todos/:id/", async (request, response) => {
  console.log(
    "we have to update a todo with ID as completed using setCompletionstatus:",
    request.params.id,
  );
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.setCompletionStatus(todo.completed);
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
