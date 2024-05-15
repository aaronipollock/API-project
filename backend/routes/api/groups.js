const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Membership, GroupImage, Venue } = require('../../db/models');

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

router.get('/:groupId', async (req, res, next) => {
    const { groupId } = req.params;

    const group = await Group.findByPk(groupId, {
        include: [
            { model: GroupImage, attributes: ['id', 'url', 'preview'] },
            { model: User, attributes: ['id', 'firstName', 'lastName'] },
            { model: Venue, attributes: {
                exclude: ['createdAt', 'updatedAt']
            } }
        ]
    });

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

    return res.json({
        Groups: updatedGroup,
    });
});

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

    return res.json({
        id: newGroup.id,
        organizerId: newGroup.organizerId,
        name: newGroup.name,
        about: newGroup.about,
        type: newGroup.type,
        private: newGroup.private,
        city: newGroup.city,
        state: newGroup.state,
        createdAt: newGroup.createdAt,
        updatedAt: newGroup.updatedAt
    })
})

router.post('/:groupId/images', requireAuth, async (req, res, next) => {
    const { groupId } = req.params;

    const { url, preview } = req.body;

    const newGroupImage = await GroupImage.create({
        groupId,
        url,
        preview,
    })

    return res.json({
        id: newGroupImage.id,
        url: newGroupImage.url,
        preview: newGroupImage.preview
    })
})

router.put('/:groupId', requireAuth, async (req, res, next) => {
    const { groupId } = req.params;

    const updatedGroup = await Group.findByPk(groupId)


    const { name, about, type, private, city, state } = req.body;

    await updatedGroup.update({
        name,
        about,
        type,
        private,
        city,
        state,
    })

    return res.json({
        id: updatedGroup.id,
        organizerId: updatedGroup.organizerId,
        name: updatedGroup.name,
        about: updatedGroup.about,
        type: updatedGroup.type,
        private: updatedGroup.private,
        city: updatedGroup.city,
        state: updatedGroup.state,
        createdAt: updatedGroup.createdAt,
        updatedAt: updatedGroup.updatedAt
    })
})




    module.exports = router;
