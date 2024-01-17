// const { request, response } = require('express')
const express = require("express");
const csrf = require("tiny-csrf");
const cookieParser = require("cookie-parser");
const app = express();
const { Todo, User } = require("./models");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));
const path = require("path");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");

const session = require("express-session");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const flash = require("connect-flash");

const saltRounds = 10;
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    secret: "my-super-secret-key-45678854345897986754",
    cookie: {
      maxAge: 242 * 60 * 60 * 1000,
    },
  }),
);

app.use(flash());
app.use(function (request, response, next) {
  response.locals.messages = request.flash();
  next();
});

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({
        where: {
          email: username,
        },
      })
        .then(async (user) => {
          console.log("comparing passwords");
          const result = await bcrypt.compare(password, user.password);
          console.log("result", result);
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Invalid password" });
          }
        })
        .catch((err) => {
          return err;
        });
    },
  ),
);

passport.serializeUser((user, done) => {
  console.log("serializing user in session", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

// const todo = require('./models/todo')
app.set("view engine", "ejs");
app.get(
  "/",
  connectEnsureLogin.ensureLoggedOut({ redirectTo: "/todos" }),
  async (request, response) => {
    response.render("index", {
      title: "Todoapplication",
      csrfToken: request.csrfToken(),
    });
  },
);

app.get(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    const allTodos = await Todo.getTodos();
    if (request.accepts("html")) {
      response.render("todos", {
        allTodos,
        title: "Todoapplication",
        user: request.user.id,
        csrfToken: request.csrfToken(),
      });
    } else {
      response.json({
        allTodos,
      });
    }
  },
);
app.use(express.static(path.join(__dirname, "public")));

app.get("/signup", (request, response) => {
  response.render("signup", {
    title: "signup",
    csrfToken: request.csrfToken(),
  });
});

app.post("/users", async (request, response) => {
  const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);
  console.log(request.body.firstName);
  console.log(request.user);
  try {
    const user = await User.create({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: hashedPwd,
    });
    request.login(user, (err) => {
      if (err) {
        console.log(err);
      }
      response.redirect("/todos");
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/login", async (request, response) => {
  response.render("login", { title: "Login", csrfToken: request.csrfToken() });
});

app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (request, response) => {
    console.log(request.user);
    response.redirect("/todos");
  },
);

app.get("/signout", (request, response, next) => {
  request.logout((err) => {
    if (err) {
      return next(err);
    }
    response.redirect("/");
  });
});

app.post(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log("creating a todo", request.body);
    try {
      if (request.body.title != null || request.body.title != null) {
        await Todo.addTodo({
          title: request.body.title,
          dueDate: request.body.dueDate,
          userId: request.user.id,
        });
      }
      return response.redirect("/todos");
    } catch (error) {
      response.render(request.flash(error, "missing values"));
      console.log(error);
      return response.status(422).json(error);
    }
  },
);
// app.put('/todos/:id/markAsCompleted', async (request, response) => {
//   console.log('we have to update a todo with ID:', request.params.id)
//   const todo = await Todo.findByPk(request.params.id)
//   try {
//     const updatedTodo = await todo.markAsCompleted()
//     return response.json(updatedTodo)
//   } catch (error) {
//     console.log(error)
//     return response.status(422).json(error)
//   }
// })

app.put(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
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
  },
);

app.delete(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log("delete a todo by ID:", request.params.id);
    try {
      const deletedTodo = await Todo.deleteTodo(
        request.params.id,
        request.user.id,
      );
      if (deletedTodo > 0) {
        return response.send(true);
      } else {
        return response.send(false);
      }
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  },
);
module.exports = app;
