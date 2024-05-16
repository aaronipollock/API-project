const express = require('express');
const { Op, UUID } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Membership, GroupImage, Venue, Event, Attendance, EventImage } = require('../../db/models');

const router = express.Router();

//Get all Groups
router.get('/', async (req, res, next) => {
    const Groups = await Group.findAll();

    const memberships = await Membership.findAll({
        attributes: ['groupId', 'status']
    });

    const previewImages = await GroupImage.findAll();

    const updatedGroups = Groups.map((group) => {
        let numMem = 0;

        memberships.forEach((membership) => {
            if (membership.groupId === group.id && membership.status === 'member') {
                numMem += 1;
            }
        });

        let previewImg = null;

        previewImages.forEach((previewImage) => {
            if (previewImage.groupId === group.id && previewImage.preview === true) {
                previewImg = previewImage.url;
                return;
            }
        });

        return {
            ...group.toJSON(),
            numMembers: numMem,
            previewImage: previewImg,
        }
    });

    return res.json({
        Groups: updatedGroups
    });
});

//Get all Groups joined or organized by the Current User
router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;

    const Groups = await Group.findAll({
        include: {
            model: Membership,
            attributes: [],
            include: { model: User }
        },
        where: {
            [Op.or]: [
                {
                    organizerId: user.id
                },
                {
                    '$Memberships.userId$': user.id,
                    '$Memberships.status$': 'member'
                }
            ]
        }
    });

    const memberships = await Membership.findAll({
        attributes: ['groupId', 'status']
    });

    const previewImages = await GroupImage.findAll();

    const updatedGroups = Groups.map((group) => {
        let numMem = 0;

        memberships.forEach((membership) => {
            if (membership.groupId === group.id && membership.status === 'member') {
                numMem += 1;
            }
        });

        let previewImg = null;

        previewImages.forEach((previewImage) => {
            if (previewImage.groupId === group.id && previewImage.preview === true) {
                previewImg = previewImage.url;
                return;
            }
        });

        return {
            ...group.toJSON(),
            numMembers: numMem,
            previewImage: previewImg,
        }
    });

    return res.json({
        Groups: updatedGroups,
    });
});

//Get details of a Groups from an id
router.get('/:groupId', async (req, res, next) => {
    const { groupId } = req.params;

    const group = await Group.findByPk(groupId, {
        include: [
            { model: GroupImage, attributes: ['id', 'url', 'preview'] },
            { model: User, attributes: ['id', 'firstName', 'lastName'] },
            {
                model: Venue, attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            }
        ]
    });

    if (!group) {
        return res.status(404).json({
            errors: {
                message: "Group couldn't be found"
            }
        })
    }

    const memberships = await Membership.findAll({
        attributes: ['groupId', 'status']
    });

    let numMem = 0;
    memberships.forEach((membership) => {
        if (membership.groupId === group.id && membership.status === 'member') {
            numMem += 1;
        }
    });

    const updatedGroup = {
        id: group.id,
        organizerId: group.organizerId,
        name: group.name,
        about: group.about,
        type: group.type,
        private: group.private,
        city: group.city,
        state: group.state,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
        numMembers: numMem,
        GroupImages: group.GroupImages,
        Organizer: group.User,
        Venues: group.Venues
    }

    return res.json(
        updatedGroup,
    );
});

//Create a Group
router.post('/', requireAuth, async (req, res, next) => {

    const { name, about, type, private, city, state } = req.body;

    const newGroup = await Group.create({
        name,
        about,
        type,
        private,
        city,
        state,
        organizerId: req.user.id
    })

    const retrievedGroup = await Group.findOne({
        order: [['id', 'DESC']]
    })

    return res.status(201).json(retrievedGroup)
})

//Add an Image to a Group based on the Group's id
router.post('/:groupId/images', requireAuth, async (req, res, next) => {
    const { groupId } = req.params;

    const group = await Group.findByPk(groupId);

    // Error if Group does not exist
    if (!group) {
        return res.status(404).json({
            errors: {
                message: "Group couldn't be found"
            }
        })
    }

    const { url, preview } = req.body;

    //Authorization
    const { user } = req;
    if (user.id === group.organizerId) {
        //Add image
        await GroupImage.create({
            groupId,
            url,
            preview,
        })

        const retreievedImage = await GroupImage.findOne({
            attributes: ['id', 'url', 'preview'],
            order: [['id', 'DESC']]
        })

        return res.json(retreievedImage)
    } else {
        return res.status(401).json({
            errors: {
                message: "Only the organizer of the group is authorized to add an image"
            }
        })
    }
})

//Edit a Group
router.put('/:groupId', requireAuth, async (req, res, next) => {
    const { groupId } = req.params;

    // Error if Group does not exist
    const updatedGroup = await Group.findByPk(groupId)
    if (!updatedGroup) {
        return res.status(404).json({
            errors: {
                message: "Group couldn't be found"
            }
        })
    }

    const { name, about, type, private, city, state } = req.body;

    const { user } = req;
    if (user.id === updatedGroup.organizerId) {
        await updatedGroup.update({
            name,
            about,
            type,
            private,
            city,
            state,
        })

        const retrievedGroup = await Group.findByPk(groupId)

        return res.json(
            retrievedGroup
        )
    } else {
        return res.status(401).json({
            errors: {
                message: "Only the owner of the group is authorized to edit"
            }
        })
    }

})

//Delete a Group
router.delete('/:groupId', requireAuth, async (req, res, next) => {
    const { groupId } = req.params;

    const group = await Group.findByPk(groupId);

    if (!group) {
        return res.status(404).json({
            errors: {
                message: "Group couldn't be found"
            }
        })
    }

    const { user } = req;
    if (user.id === group.organizerId) {
        await group.destroy()
    } else {
        return res.status(401).json({
            errors: {
                message: "Only the organizer of the group is authorized to delete"
            }
        })
    }

    return res.json({
        message: "Successfully deleted"
    })
});

//Get All Venues for a Group specified by its id
router.get('/:groupId/venues', requireAuth, async (req, res, next) => {
    const { groupId } = req.params;

    const group = await Group.findByPk(groupId, {
        include: {
            model: Venue, attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        }
    });

    // Error if Group does not exist
    if (!group) {
        return res.status(404).json({
            errors: {
                message: "Group couldn't be found"
            }
        })
    }

    const { user } = req;

    const isCohost = await Membership.findAll({
        where: {
            groupId: groupId,
            status: 'co-host'
        }
    })

    const Venues = group.Venues

    if (user.id === group.organizerId || isCohost.length) {
        return res.json({
            Venues
        })
    } else {
        return res.status(401).json({
            errors: {
                message: "Current User must be the organizer of the group or a member of the group with a status of 'co-host'"
            }
        })
    }
});

// Create a new Venue for a Group specified by its id
router.post('/:groupId/venues', requireAuth, async (req, res, next) => {
    const { groupId } = req.params;
    const { user } = req;

    const group = await Group.findByPk(groupId);

    if (!group) {
        return res.status(404).json({
            errors: {
                message: "Group couldn't be found"
            }
        })
    }

    const { address, city, state, lat, lng } = req.body;

    const isCohost = await Membership.findAll({
        where: {
            groupId: groupId,
            status: 'co-host'
        }
    })

    if (user.id === group.organizerId || isCohost.length) {
        const newVenue = await Venue.create({
            groupId,
            address,
            city,
            state,
            lat,
            lng,
        })

        const retrievedVenue = await Venue.findOne({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            order: [['id', 'DESC']],
        })

        return res.json(
            retrievedVenue
        )
    } else {
        return res.status(401).json({
            errors: {
                message: "Current User must be the organizer of the group or a member of the group with a status of 'co-host'"
            }
        })
    }
})

// Get all Events of a Group specified by its id
router.get('/:groupId/events', async (req, res, next) => {
    const { groupId } = req.params;

    const group = await Group.findByPk(groupId);

    if (!group) {
        return res.status(404).json({
            errors: {
                message: "Group couldn't be found"
            }
        })
    }

    const events = await Event.findAll({
        attributes: {
            exclude: ['description', 'capacity', 'price', 'createdAt', 'updatedAt']
        },
        include: [
            { model: Group, attributes: ['id', 'name', 'city', 'state'] },
            { model: Venue, attributes: ['id', 'city', 'state'] }
        ],
        where: {
            groupId: groupId
        }
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
    })
});

// Create an Event for a group specified by its id
router.post('/:groupId/events', requireAuth, async (req, res, next) => {
    const { groupId } = req.params;
    const { user } = req;

    const group = await Group.findByPk(groupId);

    if (!group) {
        return res.status(404).json({
            errors: {
                message: "Group couldn't be found"
            }
        })
    }

    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

    const venue = await Venue.findByPk(venueId)
    if (!venue) {
        return res.status(404).json({
            errors: {
                message: "Venue couldn't be found"
            }
        })
    }

    const isCohost = await Membership.findAll({
        where: {
            groupId: groupId,
            status: 'co-host'
        }
    })

    if (user.id === group.organizerId || isCohost.length) {
        const newEvent = await Event.create({
            groupId: groupId,
            venueId,
            name,
            type,
            capacity,
            price,
            description,
            startDate,
            endDate
        })

        const retrievedEvent = await Event.findOne({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            order: [['id', 'DESC']],
        })

        return res.json(
            retrievedEvent
        )
    } else {
        return res.status(401).json({
            errors: {
                message: "Current User must be the organizer of the group or a member of the group with a status of 'co-host'"
            }
        })
    }
})



module.exports = router;
