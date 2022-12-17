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
    const routinesCopy = [...routines];
    const stringPlaceholder = routines.map((_, index) => `$${index + 1}`).join(', ');
    const routineIds = routines.map((routine) => routine.id);
    if(!routineIds){
      return
    }

    
      const { rows: activities } = await client.query(`
        SELECT 
          activities.*,
          routine_activities.duration,
          routine_activities.count,
          routine_activities.id AS "routineActivityId",
          routine_activities."routineId"
        FROM activities
        JOIN routine_activities ON routine_activities."activityId" = activities.id
        WHERE routine_activities."routineId" IN (${stringPlaceholder})
        ;
      `, routineIds);
      for(const routine of routinesCopy){
        const activitiesMatch = activities.filter((activity) => activity.routineId === routine.id )
        routine.activities = activitiesMatch
      }
      return routinesCopy;
    
    
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
      ON CONFLICT (name) DO NOTHING
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

    console.log('fields >>>>>>', fields);

    // const obj = {}

    const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 2}`).join(", ");

    console.log("setString ---> ", setString);



  try {
    const {rows: [updated]} = await client.query(`
    UPDATE activities
    SET ${setString}
    WHERE id = $1
    RETURNING *;
  `, [id, ...Object.values(fields)]);

  console.log('updated ---->>>', updated);

  
  return updated
  } catch (error) {
    console.log('Error in updateActivity', error);
    throw error
  }
  }


module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
