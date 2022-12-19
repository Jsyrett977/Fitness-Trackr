const express = require('express');
const routinesRouter = express.Router();
const { getAllPublicRoutines, createRoutine, updateRoutine } = require('../db/routines')
// GET /api/routines
routinesRouter.get('/', async (req, res) => {
    const publicRoutines = await getAllPublicRoutines();
    res.send(publicRoutines)
})
// POST /api/routines
routinesRouter.post('/', async (req, res) => {
    console.log(req.body)
    console.log(req.user)
    const { isPublic, name, goal } = req.body;
    const creatorId = req.user.id;
    if(!creatorId){
        res.status(404).send({error: "Need to sign in before posting", message: "You must be logged in to perform this action"})
    }
    const routine = await createRoutine({creatorId, isPublic, name, goal})
    res.send(routine)
})
// PATCH /api/routines/:routineId
routinesRouter.patch("/:routineId", async (req, res, next) => {
    const { routineId } = req.params;
  
    try {

      const updateFields = { id: routineId, ...req.body };
  
      const updatedRoutine = await updateRoutine(updateFields);
      res.send(updatedRoutine);
    } catch ({ name, message }) {
      next({ name, message });
    }
  });
// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = routinesRouter;
