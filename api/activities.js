const express = require('express');
const { getAllActivities, getActivityById, createActivity, getActivityByName } = require('../db/activities');
const { getPublicRoutinesByActivity } = require('../db/routines');
const { requireUser } = require('./utils');
const router = express.Router();


// GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async (req, res, next) => {
    try {
      const id = req.params.activityId;
      const activity = await getActivityById(id);
      if (!activity) {
        res.send({
          message: `Activity ${id} not found`,
          name: 'ActivityDoesNotExistError',
          error: 'Activity does not exist',
        });
        return;
      }
      const routines = await getPublicRoutinesByActivity(activity);
      res.send(routines);
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

// GET /api/activities
/// WORKING /////// WORKING //// /// WORKING /////// WORKING //// /// WORKING /////// WORKING //// 
/// WORKING /////// WORKING //// /// WORKING /////// WORKING //// /// WORKING /////// WORKING //// 
/// WORKING /////// WORKING //// /// WORKING /////// WORKING //// /// WORKING /////// WORKING //// 
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
/// WORKING /////// WORKING //// /// WORKING /////// WORKING //// /// WORKING /////// WORKING //// 
/// WORKING /////// WORKING //// /// WORKING /////// WORKING //// /// WORKING /////// WORKING //// 
/// WORKING /////// WORKING //// /// WORKING /////// WORKING //// /// WORKING /////// WORKING //// 
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
//
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

