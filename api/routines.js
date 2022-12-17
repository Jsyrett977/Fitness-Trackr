const express = require('express');
const routinesRouter = express.Router();
const { getAllPublicRoutines } = require('../db/routines')
// GET /api/routines

// POST /api/routines

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = routinesRouter;
