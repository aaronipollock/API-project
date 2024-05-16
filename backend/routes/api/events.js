const express = require('express');
const { Op, UUID } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Event, Venue, Membership, Group, User, Attendance, EventImage } = require('../../db/models');
const attendance = require('../../db/models/attendance');

const router = express.Router();

// Get all Events
router.get('/', async (req, res, next) => {
    const events = await Event.findAll({
        attributes: {
            exclude: ['description', 'capacity', 'price', 'createdAt', 'updatedAt']
        },
        include: [
            { model: Group, attributes: ['id', 'name', 'city', 'state'] },
            { model: Venue, attributes: ['id', 'city', 'state'] }]
    })

    const attendances = await Attendance.findAll({
        attributes: ['eventId', 'status']
    })

    const previewImgs = await EventImage.findAll();

    const updatedEvents = events.map((event) => {
        let numAttending = 0;

        attendances.forEach((attendance) => {
            if (attendance.eventId === event.id && attendance.status === 'attending') {
                numAttending++;
            }
        });

        let previewImage = null;

        previewImgs.forEach((previewImg) => {
            if (previewImg.eventId === event.id && previewImg.preview === true) {
                previewImage = previewImg.url;
                return;
            }
        });

        const updatedEvent = {
            id: event.id,
            groupId: event.groupId,
            venueId: event.venueId,
            name: event.name,
            type: event.type,
            startDate: event.startDate,
            endDate: event.endDate,
            numAttending,
            previewImage,
            Group: event.Group,
            Venue: event.Venue,
        }

        return updatedEvent
    })
    return res.json({
        Events: updatedEvents
    });
});

// Get details of an Event specified by its id
router.get('/:eventId', async (req, res, next) => {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId, {
        include: [
            { model: Group, attributes: ['id', 'name', 'private', 'city', 'state'] },
            { model: Venue, attributes: ['id', 'address', 'city', 'state', 'lat', 'lng'] },
            { model: EventImage, attributes: ['id', 'url', 'preview'] }
        ],
    })

    if (!event) {
        return res.status(404).json({
            errors: {
                message: "Event couldn't be found"
            }
        })
    }

    const attendances = await Attendance.findAll({
        attributes: ['eventId', 'status']
    })

    let numAttending = 0;

    attendances.forEach((attendance) => {
        if (attendance.eventId === event.id && attendance.status === 'attending') {
            numAttending++;
        }
    });

    const updatedEvent = {
        id: event.id,
        groupId: event.groupId,
        venueId: event.venueId,
        name: event.name,
        description: event.description,
        type: event.type,
        capacity: event.capacity,
        price: event.price,
        startDate: event.startDate,
        endDate: event.endDate,
        numAttending,
        Group: event.Group,
        Venue: event.Venue,
        EventImages: event.EventImages
    }

    return res.json(updatedEvent)
});

// Add an Image to an Event based on the Event's id
router.post('/:eventId/images', requireAuth, async (req, res, next) => {
    const { eventId } = req.params;
    const { user } = req;

    const { url, preview } = req.body;

    const event = await Event.findByPk(eventId, {
        include: { model: Group, attributes: ['organizerId']}
    })

    if (!event) {
        return res.status(404).json({
            errors: {
                message: "Event couldn't be found"
            }
        })
    }

    const isAttendee = await Attendance.findAll({
        where: {
            eventId: eventId,
            userId: user.id,
            status: 'attending'
        }
    })

    const isCohost = await Membership.findAll({
        where: {
            groupId: event.groupId,
            status: 'co-host'
        }
    })

    if (user.id === event.Group.organizerId || isCohost.length || isAttendee.length) {
        await EventImage.create({
            eventId: event.id,
            url,
            preview
        })

        const retreievedEventImage = await EventImage.findOne({
            attributes: ['id', 'url', 'preview'],
            order: [['id', 'DESC']]
        })

        return res.json(retreievedEventImage);
    } else {
        return res.status(401).json({
            errors: {
                message: "Current User must be an attendee, host, or co-host of the event to add an image"
            }
        })
    }
})

//Edit an Event specified by its id
router.put('/:eventId', requireAuth, async (req, res, next) => {
    const { eventId } = req.params;
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

    const updatedEvent = await Event.findByPk(eventId, {
        include: { model: Group, attributes: ['organizerId'] }
    })

    if (!updatedEvent) {
        return res.status(404).json(
            {
                message: "Event couldn't be found"
            }
        );
    };

    const venue = await Venue.findByPk(venueId);
    if (!venue) {
        return res.status(404).json(
            {
                message: "Venue couldn't be found"

            }
        );
    };

    const isCohost = await Membership.findAll({
        where: {
            groupId: updatedEvent.groupId,
            status: 'co-host'
        }
    })

    if (req.user.id === Group.organizerId || isCohost.length) {
        await updatedEvent.update({
            venueId, name, type, capacity, price, description, startDate, endDate
        });

        const retrievedEvent = await Event.findByPk(eventId, {
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });

        return res.json(retrievedEvent);
    } else {
        return res.status(401).json({
            errors: {
                message: 'Current User must be the organizer of the group or a member of the group with a status of "co-host"'
            }
        })
    }
});

//Delete an Event specified by its id
router.delete('/:eventId', requireAuth, async (req, res, next) => {
    const { eventId } = req.params;

    const deletedEvent = await Event.findByPk(eventId, {
        include: { model: Group, attributes: ['organizerId'] }
    });

    if (!deletedEvent) {
        return res.status(404).json(
            {
                message: "Event couldn't be found"
            }
        )
    }

    const isCohost = await Membership.findAll({
        where: {
            groupId: deletedEvent.groupId,
            status: 'co-host'
        }
    })

    if (req.user.id === Group.organizerId || isCohost.length) {
        await deletedEvent.destroy();
    } else {
        return res.status(401).json({
            errors: {
                message: 'Current User must be the organizer of the group or a member of the group with a status of "co-host" to delete'
            }
        })
    }

    return res.json({
        message: "Successfully deleted"
    })
})

module.exports = router;
