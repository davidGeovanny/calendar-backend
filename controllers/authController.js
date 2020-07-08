const { response } = require('express'); /** Para tener el autocompletado */
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const { generateJWT } = require('../helpers/jwt');

const createUser = async ( req, res = response ) => {

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        
        if( user ) {
            return res.status(400).json( {
                ok: false,
                msg: 'Ya existe un usuario con el email especificado'
            });
        }

        user = new User( req.body );

        /** Encriptar contraseña */
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        await user.save();

        /** Generar JWT */
        const token = await generateJWT( user.id, user.name );
    
        res.status(201).json( {
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json( {
            ok: false,
            msg: 'Ha ocurrido un error'
        });
    }

};

const loginUser = async ( req, res = response ) => {

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        
        if( !user ) {
            return res.status(400).json( {
                ok: false,
                msg: 'El usuario con el email especificado no existe'
            });
        }

        /** Confirmar contraseña */
        const validPassword = bcrypt.compareSync( password, user.password );

        if( !validPassword ) {
            return res.status(400).json( {
                ok: false,
                msg: 'Contraseña incorrecta'
            });
        }

        /** Generar JWT */
        const token = await generateJWT( user.id, user.name );

        res.json( {
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json( {
            ok: false,
            msg: 'Ha ocurrido un error'
        });
    }
};

const revalidateToken = async ( req, res = response ) => {

    const { uid, name } = req;

    /** Generar un nuevo JWT y retornarlo al usuario */
    const token = await generateJWT( uid, name );

    res.json( {
        ok: true,
        token,
    });
};

module.exports = {
    createUser,
    loginUser,
    revalidateToken,
};