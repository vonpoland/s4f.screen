const express = require('express');
const path = require('path');
const config = require('config');
const twoDays = config.cache.maxAge ;
var router = express.Router();
var staticOptions = { maxAge: twoDays };

var basePath = path.normalize(path.join(__dirname, '../../'));

router.use('/img', express.static(basePath + '/public/img', staticOptions));
router.use('/js', express.static(basePath + '/public/js', staticOptions));
router.use('/css', express.static(basePath + '/public/css', staticOptions));
router.use('/partials', express.static(basePath + '/public/partials', staticOptions));

module.exports = router;