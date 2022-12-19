const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET = 'neverTell' } = process.env;
const { getUserById } = require('../db');

// GET /api/health
router.get('/health', (req, res) => {
  res.status(200).json({
    message: 'All is well'
  });
});

module.exports = router;


router.use(async (req, res, next) => {
    const prefix = "Bearer";
    const auth = req.header("Authorization");
  
    if (!auth) {
      next();
    } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length);
      try {
        const data = jwt.verify(token, JWT_SECRET);
          req.user = await getUserById(data.id);
          next();
      } catch (error) {
        next(error);
      }
    } else {
      next({
        name: "AuthorizationHeaderError",
        message: `Authorization token must start with ${prefix}`,
      });
    }
  });
  
// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require('./activities');
router.use('/activities', activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require('./routines');
router.use('/routines', routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require('./routineActivities');
router.use('/routine_activities', routineActivitiesRouter);

router.get('*', function(req, res){
  res.status(404);
  res.send({
      message: "404 page not found"
  })
})


module.exports = router;
