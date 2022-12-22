const express = require('express');
const { getAllActivities, getActivityById, createActivity, getActivityByName, updateActivity } = require('../db/activities');
const { getPublicRoutinesByActivity } = require('../db/routines');
const { requireUser } = require('./utils');
const { ActivityNotFoundError, ActivityExistsError } = require("../errors");
const router = express.Router();


// GET /api/activities/:activityId/routines
/// WORKING /////// WORKING //// /// WORKING /////// WORKING //// /// WORKING /////// WORKING //// 
/// WORKING /////// WORKING //// /// WORKING /////// WORKING //// /// WORKING /////// WORKING //// 
/// WORKING /////// WORKING //// /// WORKING /////// WORKING //// /// WORKING /////// WORKING //// 
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

  
// PATCH /api/activities/:activityId
router.patch('/:activityId', async (req, res, next) => {
    const { name, description } = req.body;

    const updateFields = {};
    if (name) {
      updateFields.name = name;
    }
    if (description) {
      updateFields.description = description;
    }

    try {
      const id = req.params.activityId;
      const existingActivity = await getActivityById(id);
  
      if (!existingActivity) {
        // Respond with an error if the activity does not exist
        const error = new Error(`Activity ${id} not found`);
        error.name = "ActivityNotFoundError";
        throw error;
      }
  
      // Check if there is an existing activity with the new name
      const existingActivityWithNewName = await getActivityByName(req.body.name);
      if (existingActivityWithNewName) {
        // Respond with an error if there is an existing activity with the same name
        const error = new Error(`An activity with name ${req.body.name} already exists`);
        error.name = "ActivityExistsError";
        throw error;
      }
  
      // Update the activity
      const updatedActivity = await updateActivity(id, req.body);
  
      if (updatedActivity) {
        res.send(updatedActivity);
      } else {
        // Respond with an error if there was an issue updating the activity
        const error = new Error(`There was an error updating the "${req.body.name}" activity`);
        error.name = "Error";
        error.error = `There was an error updating the "${req.body.name}" activity`;
        throw error;
      }
    } catch (error) {
      next(error);
    }
  });
  
  

module.exports = router;

