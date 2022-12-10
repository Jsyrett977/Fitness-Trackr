const client = require("./client")

// database functions
async function getAllActivities() {
    const {rows: [activities]} = await client.query(`
      SELECT * 
      FROM activities;
    `)

    console.log('activity rows', activities);
    return activities
}

async function getActivityById(id) {
  const {rows: singleActivity} = await client.query(`
    SELECT *
    FROM activities 
    WHERE id = ${id};
  `)

  console.log('Rows, getActivityById', );
  return singleActivity
}

async function getActivityByName(name) {
  const {rows: activityByName} = await client.query(`
    SELECT *
    FROM activities 
    WHERE "name" = ${name}
  `)

  console.log('activityByName', activityByName);
  return activityByName
}

// select and return an array of all activities
async function attachActivitiesToRoutines(routines) {
    const {rows} = await client.query(`
        SELECT *
        FROM activities 
        JOIN routines 
          ON activity.id 
        = routines.id;
    `)

    return rows
}

// return the new activity
async function createActivity({ name, description }) {

}

// don't try to update the id
// do update the name and description
// return the updated activity
async function updateActivity({ id, ...fields }) {

}


module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
}
