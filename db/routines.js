const client = require('./client');
const {getUserByUsername} = require('./users')
const {attachActivitiesToRoutines} = require('./activities')


async function getRoutineById(id){
  const { rows: [routine] } = await client.query(`
    SELECT *
    FROM routines
    WHERE id = $1
    ;
  `, [id])
  return routine
}

async function getRoutinesWithoutActivities(){
  const { rows } = await client.query(`
    SELECT *
    FROM routines
    ;
  `)
  return rows
}

async function getAllRoutines() {
  const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users
      ON routines."creatorId" = users.id
    ;
  `)
  return attachActivitiesToRoutines(routines)
}

async function getAllRoutinesByUser({username}) {
  const { rows: routines } = await client.query(`
  SELECT routines.*, users.username AS "creatorName"
  FROM routines
  JOIN users
    ON routines."creatorId" = users.id
  WHERE username = $1
  `, [username])
  return attachActivitiesToRoutines(routines)
}

async function getPublicRoutinesByUser({username}) {
  const { rows: routines } = await client.query(`
  SELECT routines.*, users.username AS "creatorName"
  FROM routines
  JOIN users
  ON routines."creatorId" = users.id
  WHERE username = $1
  AND "isPublic" = true
  ;
  `, [username])
  return attachActivitiesToRoutines(routines)
}

async function getAllPublicRoutines() {
  const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    WHERE "isPublic" = true
    ;
  `)
  return attachActivitiesToRoutines(routines);
}

async function getPublicRoutinesByActivity({id}) {
  const {rows: routines} = await client.query(`
  SELECT routines.*, users.username AS "creatorName"
  FROM routines
  JOIN users ON routines."creatorId" = users.id
  JOIN routine_activities
  ON routine_activities."routineId" = routines.id
  WHERE routines."isPublic" = true
  AND routine_activities."activityId" = $1
  ;
  `, [id])
  //console.log(routines)
  //return routines
  return attachActivitiesToRoutines(routines)
}

async function createRoutine({creatorId, isPublic, name, goal}) {
  const { rows: [newRoutine] } = await client.query(`
    INSERT INTO routines("creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    ;
  `, [creatorId, isPublic, name, goal])
  return newRoutine;
}

async function updateRoutine({id, ...fields}) {
  
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 2}`).join(", ");
  const { rows: [updatedRoutine] } = await client.query(`
    UPDATE routines
    SET ${setString}
    WHERE id = $1
    RETURNING *
    ;
  `, [id, ...Object.values(fields)])
  return updatedRoutine;
}

async function destroyRoutine(id) {
  await client.query(`
    DELETE FROM routine_activities
    WHERE "routineId" = $1
    ;
  `, [id])
  await client.query(`
    DELETE FROM routines
    WHERE id = $1
    ;
  `, [id])
  
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  attachActivitiesToRoutines,
  createRoutine,
  updateRoutine,
  destroyRoutine,
}