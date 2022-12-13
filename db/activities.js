const client = require("./client");

// database functions
async function getAllActivities() {
  try {
    const { rows: activities } = await client.query(`
      SELECT * 
      FROM activities;
    `);

    // console.log('activity rows ------>>>>', activities);
    return activities;
  } catch (error) {
    console.log("error in getAllActivities -->>", error);
    throw error;
  }
}

async function getActivityById(id) {
  
  try {

    const { rows: [activityById]} = await client.query(`
    SELECT *
    FROM activities
    WHERE id = $1 
  `, [id]);


    // console.log("{activityById ------>>>>>>>>>>",activityById);
    return activityById;
  } catch (error) {
    console.log("error in getActivityById", error);
  }
}

async function getActivityByName(name) {

  try {
    const { rows: [activityByName] } = await client.query(`
    SELECT *
    FROM activities 
    WHERE "name" = $1;
  `, [name]);

    // console.log("activityByName ----->>>>", activityByName);
    return activityByName;
  } catch (error) {
    console.log("error in getActivityByName", error);
  }
}

// select and return an array of all activities
async function attachActivitiesToRoutines(routines) {
  
  // const { rows } = await client.query(`
  //       SELECT *
  //       FROM activities 
  //       JOIN routines 
  //         ON activity.id 
  //       = routines.id;
  //   `);



  // console.log("joined table ----->>>>", rows);
  // return rows;
}

// return the new activity
async function createActivity({ name, description }) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
      INSERT INTO activities (name,description)
      VALUES ($1, $2)
      RETURNING *;
  `,
      [name, description]
    );

    // console.log('createActivity ---->>>>>>', activity);
    return activity;
  } catch (error) {
    console.log("error in createActivity", error);
    throw error;
  }
}

// don't try to update the id
// do update the name and description
// return the updated activity
async function updateActivity({ id, ...fields }) {

  // console.log('fields ---->>>', fields);
  // console.log('ID -->>', id);

  const {rows: [name]} = await client.query(`
    UPDATE activities
    SET name='${fields.name}'
    WHERE id = $1
    RETURNING *;

  `, [id]);
  
console.log('name ---->>>', name);
  
return name
}


module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
