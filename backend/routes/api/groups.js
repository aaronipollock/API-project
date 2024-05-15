const express = require('express');
const { Op, UUID } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Membership, GroupImage, Venue } = require('../../db/models');

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
        Groups: updatedGroups,
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

    return res.json({
        Groups: updatedGroup,
    });
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
        newGroupImage = await GroupImage.create({
            groupId,
            url,
            preview,
        })
    } else {
        return res.status(401).json({
            errors: {
                message: "Only the organizer of the group is authorized to add an image"
            }
        })
    }

    return res.json({
        id: newGroupImage.id,
        url: newGroupImage.url,
        preview: newGroupImage.preview
    })
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
    } else {
        return res.status(401).json({
            errors: {
                message: "Only the owner of the group is authorized to edit"
            }
        })
    }

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
        await Group.destroy(
            {
                where:
                    { id: groupId }
            }
        )
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

module.exports = router;
