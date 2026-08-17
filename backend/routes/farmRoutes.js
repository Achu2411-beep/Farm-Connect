const express = require('express');
const router = express.Router();
const farmController = require('../controllers/farmController');

router.get('/', farmController.getAllFarms);
router.get('/:id', farmController.getFarmById);

module.exports = router;
