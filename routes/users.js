const express = require('express');
const router = express.Router();
const users = require('../controllers/users');

//create user
router.post('/', users.create);

//read user
router.get('/:userId?', users.find);

//delete user
router.delete('/:userId', users.remove);

module.exports = router;