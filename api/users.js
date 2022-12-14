const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');


const { getAllUsers, createUser, getUserByUsername } = require('../db.users');

// POST /api/users/login
usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      next({
        name: "Missing Username or Password",
        message: "Please supply both a username and password"
      });
    }
    const token = jwt.sign({ id: 1, username: 'albert' }, process.env.JWT_SECRET);

    try {
      const user = await getUserByUsername(username, password);
      const SALT_COUNT = 10;
      const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  
      if (!user && !user.password == hashedPassword) {
        res.send({
          name: 'IncorrectCredentialsError',
          message: 'Username or password is incorrect'
        });
  
      } else {
        next({
          message: "you're logged in!", token
  
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  });
// POST /api/users/register

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
