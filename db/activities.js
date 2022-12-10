const client = require("./client")

// database functions
async function getAllActivities() {

  try {
    const {rows} = await client.query(`
      SELECT * 
      FROM activities;
    `);

    console.log('activity rows ------>>>>', rows);
    return rows

  } catch (error) {
    console.log('error in getAllActivities -->>', error);
    throw error
  }
  
}

async function getActivityById(id) {

  try {
    const {rows: singleActivity} = await client.query(`
    SELECT *
    FROM activities 
    WHERE "id" = ${id};
  `);

  console.log('Rows, getActivityById------->>>>>>>>>>' , singleActivity );
  return singleActivity
  } catch (error) {
    console.log('error in getActivityById', error);
  }
  
}

async function getActivityByName(name) {

  try {
    const {rows: activityByName} = await client.query(`
    SELECT *
    FROM activities 
    WHERE "name" = ${name};
  `);

  console.log('activityByName ----->>>>', activityByName);
  return activityByName
  } catch (error) {
    console.log('error in getActivityByName', error);
  }
 
}

// select and return an array of all activities
async function attachActivitiesToRoutines(routines) {
    const {rows} = await client.query(`
        SELECT *
        FROM activities 
        JOIN routines 
          ON activity.id 
        = routines.id;
    `);

    return rows
}

// return the new activity
async function createActivity({ name, description }) {

  try {
    const {rows: activity} = await client.query(`
      INSERT INTO activities (name,description)
      VALUES ($1, $2)
  ` , [name, description])

  return activity
  } catch (error) {
    console.log('error in createActivity', error);
    throw error
  }
  
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
