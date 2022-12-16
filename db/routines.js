const client = require('./client');
const {getUserByUsername} = require('./users')
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
    JOIN routine_activities
    ON routines.id = routine_activities."routineId"
    WHERE "activityId" NOT IN routine_activities
    ;
  `)
}

async function getAllRoutines() {
  const { rows } = await client.query(`
    SELECT *
    FROM routines;
  `)
  return rows
}

async function getAllRoutinesByUser({username}) {
  const {id} = getUserByUsername(username)

  const { rows } = client.query(`
    SELECT *
    FROM routines
    WHERE "creatorId" = $1
    ;
  `, [id])
  return rows
}

async function getPublicRoutinesByUser({username}) {
  const {id} = getUserByUsername(username);
  const { rows: publicRoutines } = await client.query(`
    SELECT *
    FROM routines
    WHERE "creatorId" = $1
    AND WHERE "isPublic" = true
    ;
  `, [id])
  return publicRoutines
}

async function getAllPublicRoutines() {
  const { rows } = await client.query(`
    SELECT *
    FROM routines
    WHERE "isPublic" = true
    ;
  `)
  return rows;
}

async function getPublicRoutinesByActivity({id}) {
  const {rows} = await client.query(`
    SELECT *
    FROM routines
    JOIN routine_activities
    ON 
  `)
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
  const {isPublic, name, goal} = fields;

  const { rows: [updatedRoutine] } = await client.query(`
    UPDATE routines
    SET "isPublic" = $1, name = $2, goal = $3
    WHERE is = $4
    ;
  `, [isPublic, name, goal, id])
  return updatedRoutine;
}

async function destroyRoutine(id) {
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
  createRoutine,
  updateRoutine,
  destroyRoutine,
}