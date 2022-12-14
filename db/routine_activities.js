const client = require('./client')

async function getRoutineActivityById(id){
  const { rows: routineActivity } = await client.query(`
    SELECT *
    FROM routine_activities
    WHERE id = $1
    ;
  `, [id])
  return routineActivity
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
    const { rows } = await client.query(`
      INSERT INTO routine_activities
      VALUES ($1, $2, $3, $4)
      RETURNING *
      ;
    `, [routineId, activityId, count, duration])
    return rows
}

async function getRoutineActivitiesByRoutine({id}) {
  const { rows } = await client.query(`
    SELECT *
    FROM routine_activities
    WHERE id = $1
    ;
  `, [id])
  return rows;
}

async function updateRoutineActivity ({id, ...fields}) {
  const {count, duration} = fields;
  await client.query(`
    UPDATE routine_activities
    SET count = $1, duration = $2
    WHERE id = $3
    ;
  `[count, duration, id])
}

async function destroyRoutineActivity(id) {
  await client.query(`
    DELETE FROM routine_activities
    WHERE id = $1
    ;
  `, [id])
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
