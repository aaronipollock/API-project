 //     const { user } = req;

    //     const groupsOrg = await Group.findAll({
    //         where: {
    //             organizerId: used.id
    //         }
    //     })

    //     const memsGroupId = await Membership.findAll({
    //         where: {
    //             userId: user.id,
    //             status: 'member'
    //         }
    //     })

    //     const groupsMember = await Group.findAll({
    //         where: {
    //             id: memsGroupId.groupId
    //         }
    //     })

    //     const previewImages = await GroupImage.findAll({
    //         attributes: ['url'],
    //         where: {
    //             [Op.or]: [{ groupId: groupsOrg.id }, { groupId: groupsMember.id }]
    //         }
    //     });

    //     let numMembers = allMembers.length;
    //     const allMembers = await Membership.findAll({
    //         where: {
    //             [Op.or]: [{ groupId: groupsOrg.id }, { groupId: groupsMember.id }],
    //             [Op.not]: [{status: 'pending'}]
    //         }
    //     })
