const express = require('express');
const router = express.Router();
const xmldatas = require('../controllers/xmldatas');

//create 
router.post('/', xmldatas.create);

//read 
router.get('/:panoId?', xmldatas.find);

//update
router.post('/update/', xmldatas.update);

//delete 
router.delete('/:panoId', xmldatas.remove);

module.exports = router;