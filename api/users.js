const express = require('express');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const { JWT_SECRET = 'neverTell' } = process.env;
const { createUser, getUserByUsername, getAllRoutinesByUser, getPublicRoutinesByUser } = require('../db');
const { requireUser } = require('./utils')
const { createUser, getUserByUsername, getAllRoutinesByUser, getPublicRoutinesByUser } = require('../db');




// POST /api/users/login
usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.send({
      name: "MissingCredentialsError",
      message: "Please suppy both a username and password"
    });
  }
  try {
    const user = await getUserByUsername(username);
    const hashedPassword = user.password
    if (user && await bcrypt.compare(password, hashedPassword)) {
      const jwtToken = jwt.sign(user, JWT_SECRET);
      res.send({ user: user, token: jwtToken, message: "you're logged in!" });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/users/register
usersRouter.post('/register', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const _user = await getUserByUsername(username);
    if (_user) {
      res.send({
        error: "UserExistsError",
        message: "User " + username + " is already taken.",
        name: 'UsernameExists',
      });
    } else if(password.length < 8) {
      res.send({
        error: "PasswordLengthError",
        message: "Password Too Short!",
        name: "Short Password",
      });
      } else {
      const user = await createUser({username, password});

      if (user) {
      const jwtToken = jwt.sign(user, JWT_SECRET);
       const response =  {
          message: "thank you for signing up",
          token: jwtToken,
          user: {
            id: user.id,
            username: user.username,
          },
        }
        res.send(response);
      }
    }
  } catch ({ name, message }) {
    next({ name, message })
  }
});


// GET /api/users/me
usersRouter.get('/me', requireUser, async (req, res, next) => {
  try {
    if (req.user) {
      res.send(req.user);
    } else {
      res.status(401).send({
        error: "401 - Unauthorized",
        message: "You must be logged in to perform this action",
        name: "UnauthorizedError",
      });
    }
  } catch (error) {
    res.status(500)
    next(error);
  }
});


// GET /api/users/:username/routines



usersRouter.get("/:username/routines", requireUser, async (req, res, next) => {
  try {
    const {username} = req.params;
    const user = await getUserByUsername(username);
    if(!user) {
      res.send({
        name: 'NoUser',
        message: `Error looking up user ${username}`
      });
    } else if(req.user && user.id === req.user.id) {
      const routines = await getAllRoutinesByUser({username: username});
      res.send(routines);
    } else {
      const routines = await getPublicRoutinesByUser({username: username});
      res.send(routines);
    }
  } catch (error) {
    next(error)
  }
})


module.exports = usersRouter;