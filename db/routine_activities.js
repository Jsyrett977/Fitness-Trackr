const client = require('./client')

async function getRoutineActivityById(id){
  const { rows } = await client.query(`
    SELECT *
    FROM routine_activities
    WHERE id = $1
    ;
  `, [id])
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
    
}

async function getRoutineActivitiesByRoutine({id}) {
}

async function updateRoutineActivity ({id, ...fields}) {
}

async function destroyRoutineActivity(id) {
}

async function canEditRoutineActivity(routineActivityId, userId) {
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
