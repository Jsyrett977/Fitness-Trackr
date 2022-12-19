const express = require('express');
const router = express.Router();
const { getRoutineActivityById, updateRoutineActivity, getRoutineById, destroyRoutineActivity } = require('../db/index')
// PATCH /api/routine_activities/:routineActivityId
router.patch("/:routineActivityId", async (req, res, next) => {
    const { count, duration } = req.body;
    const id = req.params.routineActivityId;
    try {
      const routineActivity = await getRoutineActivityById(id);
      const routine = await getRoutineById(routineActivity.routineId);
      if (req.user.id !== routine.creatorId) {
        res.status(401).send({
        error: "NotAuthorized",
        message: `User ${req.user.username} is not allowed to update ${routine.name}`,
        name: "Not Authorized"});
      } else {
        const updatedRoutineAct = await updateRoutineActivity({
          id,
          count,
          duration,
        });
        if (updatedRoutineAct) {
          res.send(updatedRoutineAct);
        } else {
          next({ name: "Routine does not exist" });
        }
      }
    } catch (error) {
      next(error);
    }
  });
// DELETE /api/routine_activities/:routineActivityId
router.delete("/:routineActivityId", async (req, res, next) => {
    const { routineActivityId } = req.params;
    try {
      const routineActivity = await getRoutineActivityById(routineActivityId);
      const routine = await getRoutineById(routineActivity.routineId);
      if (req.user.id === routine.creatorId) {
        const destroyActivity = await destroyRoutineActivity(routineActivityId);
        res.send(destroyActivity);
      } else {
        res.status(403).send({
            error: "NotAuthorized",
            message: `User ${req.user.username} is not allowed to delete ${routine.name}`,
            name: "Not Authorized"})
      }
    } catch ({ message }) {
      next({ message });
    }
  });
module.exports = router;
