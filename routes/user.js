const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const checkEmail = require('../middleware/email');
const checkPassword = require('../middleware/password');

router.post('/signup', checkEmail, checkPassword, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;