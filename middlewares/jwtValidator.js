const { response } = require('express');
const jwt = require('jsonwebtoken');

const jwtValidator = ( req, res = response, next ) => {
    /** Token en x-token */

    const token = req.header('x-token');

    if( !token ) {
        return res.status(401).json( {
            ok: false,
            msg: 'No se ha proporcionado un token de acceso'
        });
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED,
        );

        req.uid = payload.uid;
        req.name = payload.name;
        
    } catch (error) {
        console.log(error)
        return res.status(401).json( {
            ok: false,
            msg: 'Token no válido'
        });
    }

    next();
};

module.exports = {
    jwtValidator,
}