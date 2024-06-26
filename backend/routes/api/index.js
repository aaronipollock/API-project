// backend/routes/api/index.js
const router = require("express").Router();
const eventimagesRouter = require('./event-images.js');
const eventsRouter = require('./events.js');
const groupsRouter = require('./groups.js');
const groupimagesRouter = require('./group-images.js');
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const venuesRouter = require('./venues.js');
const { restoreUser } = require("../../utils/auth.js");


// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/event-images', eventimagesRouter);
router.use('/events', eventsRouter);
router.use('/groups', groupsRouter);
router.use('/group-images', groupimagesRouter);
router.use('/session', sessionRouter);
router.use('/venues', venuesRouter);
router.use('/users', usersRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
