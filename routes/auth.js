/**
 * Auth routes
 * host + /api/auth
 */

const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const { createUser, loginUser, revalidateToken } = require('../controllers/authController');
const { fieldsValidator } = require('../middlewares/fieldsValidator');
const { jwtValidator } = require('../middlewares/jwtValidator');

router.post(
    '/new', 
    [ 
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres mínimo').isLength({ min: 6 }),
        fieldsValidator,
    ], 
    createUser
);

router.post(
    '/', 
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña debe de ser de 6 caracteres mínimo').isLength({ min: 6 }),
        fieldsValidator,
    ],
    loginUser
);

router.get(
    '/renew', 
    [
        jwtValidator
    ],
    revalidateToken
);

module.exports = router;