const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    //Read token from header
    const token = req.header('x-auth-token');
    
    //Verifying token
    if(!token){
        return res.status(401).json({msg: 'No hay token, permiso no válido'});
    }

    //Validate token
    try {
        const encryption = jwt.verify(token, process.env.SECRET);
        req.user = encryption.user;
        next();
    } catch (error) {
        return res.status(401).json({msg: 'Token no válido'});
    }

}