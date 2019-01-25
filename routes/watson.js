const express = require('express');

const watsonController = require('../controllers/watson');

const router = express.Router();

router.get('/', watsonController.getIndex);

router.post('/', watsonController.postNlu);

router.get('/getmodel', watsonController.getNluModel);

module.exports = router;