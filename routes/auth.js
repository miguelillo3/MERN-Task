//Routes to authenticate users
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

//Registering an user
// api/auth
router.post('/', authController.authUsers);

//Getting authenticated user recently created
router.get('/',
auth,
authController.getAuthUser
);

module.exports = router;