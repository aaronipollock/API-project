const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, Membership, GroupImage } = require('../../db/models');

const router = express.Router();

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

        let previewImg;

        previewImages.forEach((previewImage) => {
            if (previewImage.groupId === group.id && previewImage.preview === true) {
                previewImg = previewImage.url;
            } else {
                previewImg = null;
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

module.exports = router;
