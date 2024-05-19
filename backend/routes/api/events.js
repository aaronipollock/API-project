const express = require('express');
const { Op, UUID } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Event, Venue, Membership, Group, User, Attendance, EventImage } = require('../../db/models');
const attendance = require('../../db/models/attendance');

const router = express.Router();

// Get all Events
// Add Query Filters to Get All Events
router.get('/', async (req, res, next) => {
    let { page, size, name, type, startDate } = req.query;

    page = parseInt(page);
    size = parseInt(size);

    if (isNaN(page) || page <= 0) page = 1;
    if (isNaN(size) || size <= 0) size = 2;

    if (typeof (name) !== 'string' ||
        typeof (type) !== 'string' ||
        (type !== 'Online' && type !== 'In person') ||
        typeof (startDate) !== 'string') {
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                page: "Page must be greater than or equal to 1",
                size: "Size must be greater than or equal to 1",
                name: "Name must be a string",
                type: "Type must be 'Online' or 'In Person'",
                startDate: "Start date must be a valid datetime",
            }
        })
    }

    const events = await Event.findAll({
        attributes: {
            exclude: ['description', 'capacity', 'price', 'createdAt', 'updatedAt']
        },
        include: [
            { model: Group, attributes: ['id', 'name', 'city', 'state'] },
            { model: Venue, attributes: ['id', 'city', 'state'] }],
        limit: size,
        offset: size * (page - 1)
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
        include: { model: Group, attributes: ['organizerId'] }
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
            userId: user.id,
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
            userId: req.user.id,
            status: 'co-host'
        }
    })

    if (req.user.id === updatedEvent.Group.organizerId || isCohost.length) {
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
                message: "Current User must be the organizer of the group or a member of the group with a status of 'co-host'"
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

    const isOrganizer = await Group.findOne({
        where: {
            organizerId: req.user.id,
        }
    })

    const isCohost = await Membership.findOne({
        where: {
            groupId: deletedEvent.groupId,
            userId: req.user.id,
            status: 'co-host'
        }
    })

    if (isOrganizer || isCohost) {
        await deletedEvent.destroy();
    } else {
        return res.status(401).json({
            errors: {
                message: 'Current User must be the organizer of the group or a member of the group with a status of co-host to delete'
            }
        })
    }

    return res.json({
        message: "Successfully deleted"
    })
})

//Get all Attendees of an Event specified by its id
router.get('/:eventId/attendees', async (req, res, next) => {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId, {
        include: [
            { model: Group },
            { model: User, attributes: ['id', 'firstName', 'lastname'], include: { model: Attendance, attributes: ['status'] } }
        ]
    })

    if (!event) {
        return res.status(404).json({
            message: "Event couldn't be found"
        })
    }

    const isOrgOrCo = await Membership.findAll({
        where: {
            groupId: event.Group.id,
            userId: req.user.id,
            [Op.or]: [
                { status: 'co-host' },
                { status: 'organizer' },
            ]
        }
    });

    if (isOrgOrCo.length) {
        const pending = await User.findAll({
            attributes: ['id', 'firstName', 'lastName'],
            include: {
                model: Attendance, attributes: ['status'], where: {
                    eventId: eventId,
                },
            }
        });
        return res.json({
            Attendees: pending
        })
    } else {
        const notPending = await User.findAll({
            attributes: ['id', 'firstName', 'lastName'],
            include: {
                model: Attendance, attributes: ['status'], where: {
                    eventId: eventId,
                    [Op.not]: [{ status: 'pending' }]
                },
            }
        });

        return res.json({
            Attendees: notPending
        })
    }
});

//Request to Attend an Event based on the Event's id
router.post('/:eventId/attendance', requireAuth, async (req, res, next) => {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId)

    if (!event) {
        return res.status(404).json({
            message: "Event couldn't be found"
        })
    }

    const existingAttendee = await Attendance.findOne({
        where: {
            eventId: eventId,
            userId: req.user.id,
            status: 'attending'
        }
    })
    if (existingAttendee) {
        return res.status(400).json({
            message: "User is already an attendee of the event"
        })
    }

    const existingRequest = await Attendance.findOne({
        where: {
            eventId: eventId,
            userId: req.user.id,
            status: 'pending'
        }
    })

    if (existingRequest) {
        return res.status(400).json({
            message: "Attendance has already been requested"
        })
    }

    const memsByGroupId = await Membership.findOne({
        where: {
            groupId: event.groupId,
            userId: req.user.id,
            [Op.not]: { status: 'pending' }
        }
    })
    if (memsByGroupId) {
        await Attendance.create({
            eventId,
            userId: req.user.id,
            status: 'pending'
        })

        const retrievedRequest = await Attendance.findOne({
            order: [['id', 'DESC']],
            attributes: ['userId', 'status']
        })

        return res.json(retrievedRequest)
    } else {
        return res.status(401).json({
            errors: {
                message: 'Current User must be a member of the group to request attendance'
            }
        })
    }
});

//Change the status of an attendance for an event specified by id
router.put('/:eventId/attendance', requireAuth, async (req, res, next) => {
    const { eventId } = req.params;

    const { userId, status } = req.body;

    if (status === 'pending') {
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                status: "Cannot change an attendance status to pending"
            }
        })
    };

    const user = await User.findByPk(userId);
    if (!user) {
        return res.status(404).json({
            message: "User couldn't be found"
        })
    };
    
    const event = await Event.findByPk(eventId);
    if (!event) {
        return res.status(404).json({
            message: "Event couldn't be found"
        })
    }

    const updatedAttendance = await Attendance.findOne({
        where: {
            eventId: eventId,
            userId: userId
        }
    })

    if (!updatedAttendance) {
        return res.status(404).json({
            message: "Attendance between the user and the event does not exist"
        })
    }

    const isOrganizer = await Group.findOne({
        where: {
            organizerId: req.user.id,
        }
    })


    const isCohost = await Membership.findOne({
        where: { status: 'co-host', userId: req.user.id }
    });

    console.log(isCohost)
    if (isCohost || isOrganizer) {
        await updatedAttendance.update({
            userId,
            status
        })

        const retrievedAttendance = await Attendance.findOne({
            attributes: ['id', 'eventId', 'userId', 'status'],
            where: {
                eventId,
                userId,
                status,
            }
        });

        return res.json({
            id: retrievedAttendance.id,
            eventId: retrievedAttendance.eventId,
            userId: retrievedAttendance.userId,
            status: retrievedAttendance.status
        })
    } else {
        return res.status(401).json({
            errors: {
                message: 'Current User must be an organizer or co-host to change status of attending'
            }
        })
    }
});

//Delete attendance to an event specified by id
router.delete('/:eventId/attendance/:userId', requireAuth, async (req, res, next) => {
    const { eventId, userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
        return res.status(404).json({
            message: "User couldn't be found"
        })
    };

    const event = await Event.findByPk(eventId);
    if (!event) {
        return res.status(404).json({
            message: "Event couldn't be found"
        })
    }

    const deleteAttendance = await Attendance.findOne({
        where: {
            eventId,
            userId
        }
    })

    if (!deleteAttendance) {
        return res.status(404).json({
            message: "Attendance does not exist for this User"
        })
    }

    const isOrg = await Membership.findOne({
        where: {
            userId: req.user.id,
            status: 'organizer'
        }
    })

    if (isOrg || req.user.id == userId) {
        await Attendance.destroy({
            where: {
                eventId,
                userId
            }
        })
        return res.json({
            message: "Successfully deleted attendance from event"
        })
    } else {
        return res.status(401).json({
            errors: {
                message: 'Current User must be an organizer or user whose attendance is being deleted'
            }
        })
    }
});




module.exports = router;
