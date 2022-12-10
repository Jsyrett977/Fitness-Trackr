const client = require('./client');
const {getUserByUsername} = require('./users')
async function getRoutineById(id){
  const { rows } = await client.query(`
    SELECT *
    FROM routines
    WHERE id = $1
    ;
  `, [id])
}

async function getRoutinesWithoutActivities(){
}

async function getAllRoutines() {
  const { rows } = await client.query(`
    SELECT *
    FROM routines;
  `)
  console.log(rows)
}

async function getAllRoutinesByUser({username}) {
  const {id} = getUserByUsername(username)

  const { rows } = client.query(`
    SELECT *
    FROM routines
    WHERE "creatorId" = $1
    ;
  `, [id])
  console.log(rows)
}

async function getPublicRoutinesByUser({username}) {
  const {id} = getUserByUsername(username);
  const { rows } = await client.query(`
    SELECT *
    FROM routines
    WHERE "creatorId" = $1
    AND WHERE "isPublic" = true
    ;
  `, [id])
}

async function getAllPublicRoutines() {
  const { rows } = await client.query(`
    SELECT *
    FROM routines
    WHERE "isPublic" = true
    ;
  `)
}

async function getPublicRoutinesByActivity({id}) {
}

async function createRoutine({creatorId, isPublic, name, goal}) {
  await client.query(`
    INSERT INTO routines("creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
  `, [creatorId, isPublic, name, goal])
}

async function updateRoutine({id, ...fields}) {
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