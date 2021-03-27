const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { addLike, getLikes, deleteLike } = require('./like.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getLikes)
router.post('/', addLike)
router.delete('/:id', requireAuth, deleteLike)

module.exports = router
