const express = require('express');
const { verify } = require('jsonwebtoken');
const routinesRouter = express.Router();
const { getAllPublicRoutines, createRoutine, updateRoutine } = require('../db/routines')
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
routinesRouter.post('/', requireUser, async (req, res) => {
    const { isPublic, name, goal } = req.body;
    console.log(req.user)
    const creatorId = req.user.id;
    if(!creatorId){
        res.status(404).send({error: "Need to sign in before posting", message: "You must be logged in to perform this action"})
    }
    const routine = await createRoutine({creatorId, isPublic, name, goal})
    res.send(routine)
})
// PATCH /api/routines/:routineId
routinesRouter.patch("/:routineId", requireUser, async (req, res, next) => {
    const { routineId } = req.params;
  
    try {

      const updateFields = { id: routineId, ...req.body };
      if(!updateFields){
        res.status(404).send({message: "Missing Fields"})
      }
      const updatedRoutine = await updateRoutine(updateFields);
      res.send(updatedRoutine);
    } catch ({ name, message }) {
      next({ name, message });
    }
  });
// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = routinesRouter;
