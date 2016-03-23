'use strict';

var express = require('express');
var controller = require('./tictac.controller');

var router = express.Router();

router.post('/checkWinner', controller.isWinner);


module.exports = router;
