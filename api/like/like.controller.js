const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const likeService = require('./like.service')
const notificationService = require('../notification/notification.service')

async function getLikes(req, res) {
    try {
        const likes = await likeService.query(req.query)
        res.send(likes)
    } catch (err) {
        logger.error('Cannot get likes', err)
        res.status(500).send({ err: 'Failed to get likes' })
    }
}

async function deleteLike(req, res) {
    try {
        console.log('req.params.ids', req.params.id);
        await likeService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete like', err)
        res.status(500).send({ err: 'Failed to delete like' })
    }
}


async function addLike(req, res) {
    console.log('blahhhhhh');
    try {
        console.log('like controller!!!!');
        var like = req.body
        console.log('like', like);
        // like.byUserId = req.session.user._id;
        await likeService.add(like);
        await notificationService.add(like);
        // like = await likeService.add(like);
        // like.byUser = req.session.user
        // like.aboutUser = await userService.getById(like.aboutUserId)
        res.send(like)

    } catch (err) {
        logger.error('Failed to add like', err)
        res.status(500).send({ err: 'Failed to add like' })
    }
}

module.exports = {
    getLikes,
    deleteLike,
    addLike
}
