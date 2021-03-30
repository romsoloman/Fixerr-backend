const express = require('express')
// const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getNotifications } = require('./notification.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getNotifications)
// router.post('/', addLike)
// router.delete('/:id', deleteLike)

module.exports = router
