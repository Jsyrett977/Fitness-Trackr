const express = require('express');
const { getAllActivities, getActivityById, createActivity } = require('../db/activities');
const { getUserById, getUserByUsername } = require('../db/users');
const router = express.Router();

// GET /api/activities/:activityId/routines
router.get('api/actvities/:activityId/routines', (req, res, next) => {

   console.log('res--->', res);
})

// GET /api/activities
router.get('api/activities', (req, res, next) => {
    const activities = getAllActivities();
    res.send(activities)
})

// POST /api/activities
router.post('api/activities',(req, res, next) => {
    const createActivity = createActivity();
    const user = getUserByUsername();

    if(createActivity){
        createActivity()
    } else {
        res.status(404).send("error creating activity")
    }
    
    console.log(req)
})
// PATCH /api/activities/:activityId

router.patch('api/activities/:activityId', (req, res, next) => {
    const activity = getActivityById(req.params.id)
    // res.send(activity)

    if(activity){
        res.send(activity)
    } else {
        res.status(404).send('activity with that id not found')
    }
    
    console.log('res --->', res)
})

module.exports = router;
