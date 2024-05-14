const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Membership, GroupImage } = require('../../db/models');

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

// router.get('/:groupId', async (req, res, next) => {
//     const { id } = req.params.groupId;

//     const groupsById = await Group.findByPk(id, {
//         include: GroupImage, Venue
//     });




// })

module.exports = router;
