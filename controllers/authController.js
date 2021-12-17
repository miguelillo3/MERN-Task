const Users = require('../models/Users');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


exports.authUsers = async (req, res) => {
    //Check for errors in express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //Getting the fields
    const { email, password } = req.body;
    try {
        //Check email exists 
        let user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'El email no existe' });
        }
        //Verifying password
        const correctPass = await bcryptjs.compare(password, user.password);
        if (!correctPass) {
            return res.status(400).json({ msg: 'Password incorrecto' });
        }
        
        //Create a sign JWT
        const payload = {
            user: {
                id: user.id
            }
        };
        //Sign the JWT
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600
        }, (error, token) => {
            if (error) throw error;

            //Confirmation message
            res.json({ token });
        });

    } catch (error) {
        console.log('Hay un error: ', error);
        res.status(500).send('Error autenticando usuario');
    }
}

//Getting user (recently created) through authenticated middleware
exports.getAuthUser = async (req, res) => {
    try { 
        //Get the user by id from token 
        const user = await Users.findOne({ _id: req.user.id }).select('-password');
        res.json({user});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error accediendo al usuario autenticado'});
    }
}