const express = require('express');
const { Op, UUID } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Venue, Membership, Group, User } = require('../../db/models');

const router = express.Router();

// Edit a venue specified by its id
router.put('/:venueId', requireAuth, async (req, res, next) => {
    const { venueId } = req.params;
    const { user } = req;

    const updatedVenue = await Venue.findByPk(venueId);

    if (!updatedVenue) {
        return res.status(404).json({
            errors: {
                message: "Venue couldn't be found"
            }
        })
    };

    const { address, city, state, lat, lng } = req.body;

    const isCohost = await Membership.findAll({
        where: {
            groupId: user.id,
            status: 'co-host'
        }
    });

    const isOrganizer = await Group.findAll({
        where: {
            organizerId: user.id,
        }
    })

    if (isOrganizer.length || isCohost.length) {
        await updatedVenue.update({
            address,
            city,
            state,
            lat,
            lng
        })

        return res.json({
            id: updatedVenue.id,
            groupId: updatedVenue.groupId,
            address: updatedVenue.address,
            city: updatedVenue.city,
            state: updatedVenue.state,
            lat: updatedVenue.lat,
            lng: updatedVenue.lng,
        })
    } else {
        return res.status(401).json({
            errors: {
                message: "Current User must be the organizer of the group or a member of the group with a status of 'co-host'"
            }
        })
    }
})










module.exports = router;
