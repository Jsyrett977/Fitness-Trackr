const express = require('express');
const { verify } = require('jsonwebtoken');
const routinesRouter = express.Router();
const { getAllPublicRoutines, createRoutine, updateRoutine, getRoutineById, destroyRoutine } = require('../db/routines')
const {addActivityToRoutine, getRoutineActivityById } = require('../db/index')
const { requireUser } = require('./utils')
// GET /api/routines
routinesRouter.get('/', async (req, res) => {
    try{
    const publicRoutines = await getAllPublicRoutines();
    res.send(publicRoutines)
    } catch(error){
        res.send(error.name, error.message)
    }
})
// POST /api/routines
routinesRouter.post('/', requireUser, async (req, res, next) => {
    const { isPublic, name, goal } = req.body;
    try{
    const creatorId = req.user.id;
    if(!creatorId){
        res.status(404).send({error: "Need to sign in before posting", message: "You must be logged in to perform this action"})
    }
    const routine = await createRoutine({creatorId, isPublic, name, goal})
    res.send(routine)
}catch(error){
    res.status(401);
    next();
}
})
// PATCH /api/routines/:routineId
routinesRouter.patch("/:routineId", requireUser, async (req, res, next) => {
    const routineId = req.params.routineId;
  
    try {

      const updateFields = { id: routineId, ...req.body };
      if(!updateFields){
       res.status(404).send({message: "Missing Fields"})
      }
      const updatedRoutine = await updateRoutine(updateFields);
      res.send(updatedRoutine);
    } catch ({ name, message }) {
        res.status(403.).send({ name, message })
    }
  });
// DELETE /api/routines/:routineId
routinesRouter.delete("/:routineId", requireUser, async (req, res, next) => {
    const id = req.params.routineId;
    try {
      const routine = await getRoutineById(id);
      if (routine.creatorId !== req.user.id) {
          res.status(403).send({
          error: "UnauthorizedUserError",
          message: `User ${req.user.username} is not allowed to delete ${routine.name}`,
          name: "Unauthorized User Error"
        });
      } else {
        await destroyRoutine(routine.id);
        res.send(routine);
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });
// POST /api/routines/:routineId/activities
routinesRouter.post("/:routineId/activities", requireUser, async (req, res, next) => {
      const { activityId, duration, count } = req.body;
      const { routineId } = req.params;
      const routineActId = await getRoutineActivityById(activityId);
      try {
        if (routineActId) {
          res.send({
            error: "Existing Id Error",
            message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`,
            name: "ExistingIdError",
          });
        } else {
          const addedActivity = await addActivityToRoutine({
            routineId,
            activityId,
            duration,
            count,
          });
          res.send(addedActivity);
        }
      } catch ({ name, message }) {
        next({ name, message });
      }
    }
  );
module.exports = routinesRouter;
