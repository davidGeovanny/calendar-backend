/**
 * Event routes
 * host + /api/events
 */

const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventsController');
const { jwtValidator } = require('../middlewares/jwtValidator');
const { fieldsValidator } = require('../middlewares/fieldsValidator');
const { isDate } = require('../helpers/isDate');

/** Agregar un middleware a todas las rutas que debajo */
router.use( jwtValidator );

router.get(
    '/',
    [
        
    ],
    getEvents
);

router.post(
    '/',
    [
        check('title', 'El título es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'La fecha de finalización es obligatoria').custom( isDate ),
        fieldsValidator,
    ],
    createEvent
);

router.put(
    '/:id',
    [
        check('title', 'El título es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'La fecha de finalización es obligatoria').custom( isDate ),
        fieldsValidator,
    ],
    updateEvent
);

router.delete(
    '/:id',
    [

    ],
    deleteEvent
);

module.exports = router;