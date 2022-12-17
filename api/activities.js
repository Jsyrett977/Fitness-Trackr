const express = require('express');
const { getAllActivities, getActivityById, createActivity, getActivityByName } = require('../db/activities');
const { getPublicRoutinesByActivity } = require('../db/routines');
const { getUserById, getUserByUsername, getUser } = require('../db/users');
const router = express.Router();


// GET /api/activities/:activityId/routines
router.get('/api/activities/:activityId/routines', async (req, res, next) => {
    const activityId = req.params.activityId;
    const getPublicRoutines = await getPublicRoutinesByActivity({activityId});

    if(getPublicRoutines){
        res.send(getPublicRoutines)
    } else {
        res.status(404).send("Activity 10000 not found")
    }
})

// GET /api/activities
/// WORKING /////// WORKING ////
router.get('/', async(req, res, next) => {
    const activities = await getAllActivities();

    try {
        if(activities){
            res.send(activities)
        }
    } catch (error) {
        next()
    }
   
})

// POST /api/activities
router.post('/', async (req, res, next) => {
    
    try {
        const {name, description} = req.body
        const existingActivity = await getActivityByName(name)

        
        if(existingActivity){
            next({
                name: "name not found",
                message: `An activity with name ${name} already exists`
            })
        } else {
            const newActivity = await createActivity({name, description});
    
            if(newActivity){
                res.send(newActivity)
            } else {
                next({
                    name: "name not found",
                    message: `There was an error creating the ${name} activity `
                })
            }
        }
    } catch (error) {
        next(error)
    }
    
    
})

// PATCH /api/activities/:activityId

router.patch('/api/activities/:activityId', async (req, res, next) => {
    const id = req.params.id
    const activity = await getActivityById(id)
    // res.send(activity)

    if(activity){
        res.send(activity)
    } else {
        res.status(404).send('activity with that id not found')
    }
    
    console.log('res --->', res)
})

module.exports = router;
