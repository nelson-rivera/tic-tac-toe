'use strict';

var express = require('express');
var controller = require('./thing.controller');

var router = express.Router();

router.post('/checkWinner', controller.isWinner);


module.exports = router;
