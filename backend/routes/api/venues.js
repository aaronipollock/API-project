const express = require('express');
const { Op, UUID } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Venue } = require('../../db/models');

const router = express.Router();

//Get All Venues for a Group soecified by its id
router.get('')










module.exports = router;
