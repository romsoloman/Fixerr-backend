const logger = require('../../services/logger.service')
// const userService = require('../user/user.service')
// const likeService = require('./like.service')
const notificationService = require('../notification/notification.service')

async function getNotifications(req, res) {
  try {
    const notifications = await notificationService.query(req.session.user._id);
    console.log('notifications', notifications);
    res.send(notifications)
  } catch (err) {
    logger.error('Cannot get notifications', err)
    res.status(500).send({ err: 'Failed to get notifications' })
  }
}

module.exports = {
  getNotifications
}
