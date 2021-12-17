//Routes to create users
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { check } = require('express-validator');

//Create an user
// api/users
router.post('/',
    [
        check('nameuser', 'Debe suministrar el nombre').trim().isLength({ min: 1 }),
        check('email', 'Debe suministrar un email válido').trim().isEmail(),
        check('password', 'Debe suministrar un password de al menos 6 caracteres').trim().isLength({ min: 6 })
    ],
    usersController.createUser);

module.exports = router;