const express = require('express');
const { Op, UUID } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Event, Venue, Membership, Group, User, Attendance, EventImage, GroupImage } = require('../../db/models');
const attendance = require('../../db/models/attendance');

const router = express.Router();

// Delete an Image for a Group
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { imageId } = req.params;

    const image = await GroupImage.findByPk(imageId)

    if(!image) {
        return res.status(404).json({
            message: "Group Image couldn't be found"
        })
    }

    const isOrganizer = await Group.findOne({
        where: {
            organizerId: req.user.id,
        }
    })

    const isCohost = await Membership.findOne({
        where: {
            groupId: image.groupId,
            userId: req.user.id,
            status: 'co-host'
        }
    });

    if (isOrganizer || isCohost) {
        await GroupImage.destroy({
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
