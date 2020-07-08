const { response } = require('express');
const Event = require('../models/EventModel');
const { findByIdAndUpdate, findById } = require('../models/EventModel');

const getEvents = async ( req, res = response ) => {

    const events = await Event
                            .find()
                            .populate('user', 'name') /** Separar atributos a seleccionar por espacio */
    
    res.json( {
        ok: true,
        events
    });
};

const createEvent = async ( req, res = response ) => {

    const event = new Event( req.body );

    try {
        event.user = req.uid;

        const eventSaved = await event.save();

        res.json( {
            ok: true,
            event: eventSaved
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json( {
            ok: false,
            msg: 'Ha ocurrido un error',
        });
    }
};

const updateEvent = async ( req, res = response ) => {

    const eventId = req.params.id;
    const { uid } = req;

    try {

        const event = await Event.findById( eventId );
        
        if( !event ) {
            return res.status(404).json( {
                ok: false,
                msg: 'El evento especificado no existe'
            });
        }

        if( event.user.toString() !== uid ) {
            return res.status(401).json( {
                ok: false,
                msg: 'No tiene los permisos para actualizar este evento'
            });
        }

        const newEvent = {
            ...req.body,
            user: uid
        };

        const eventUpdated = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } );

        res.json( {
            ok: true,
            event: eventUpdated,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json( {
            ok: false,
            msg: 'Ha ocurrido un error',
        });
    }
};

const deleteEvent = async ( req, res = response ) => {

    const eventId = req.params.id;
    const { uid } = req;

    try {
        const event = await Event.findById( eventId );
    
        if( !event ) {
            return res.status(404).json( {
                ok: false,
                msg: 'El evento especificado no existe'
            });
        }
    
        if( event.user.toString() !== uid ) {
            return res.status(401).json( {
                ok: false,
                msg: 'No tiene los permisos para eliminar este evento'
            });
        }

        const eventDeleted = await Event.findByIdAndDelete( eventId );

        res.json( {
            ok: true,
            event: eventDeleted
        });    
    } catch (error) {
        console.log(error);
        return res.status(500).json( {
            ok: false,
            msg: 'Ha ocurrido un error'
        });
    }

};

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
};