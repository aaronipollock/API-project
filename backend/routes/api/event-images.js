const express = require('express');
const { Op, UUID } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Event, Venue, Membership, Group, User, Attendance, EventImage } = require('../../db/models');
const attendance = require('../../db/models/attendance');

const router = express.Router();

//Delete an Image for an Event
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { imageId } = req.params;

    const image = await EventImage.findByPk(imageId, {
        include: { model: Event }
    })

    if(!image) {
        return res.status(404).json({
            message: "Event Image couldn't be found"
        })
    }

    const isOrgOrCo = await Membership.findAll({
        where: {
            groupid: image.Event.groupId,
            userId: req.user.id,
            [Op.or]: [
                { status: 'co-host' },
                { status: 'organizer' },
            ]
        }
    });

    if (isOrgOrCo) {
        await EventImage.destroy({
            where: {
                id: imageId
            }
        })

        return res.json({
            message: "Successfully deleted"
        })
    } else {
        return res.status(401).json({
            errors: {
                message: "Current User must be the organizer or cohost of the group to delete image"
            }
        })
    }
});





module.exports = router;
