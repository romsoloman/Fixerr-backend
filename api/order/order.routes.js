const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getOrder, getOrders, deleteOrder, updateOrder, addOrder } = require('./order.controller')
const { addReview, getReviews, deleteReview } = require('../review/review.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getOrders)
router.get('/:id', getOrder)
router.get('/:id/review', getReviews)
// router.post('/', requireAuth, requireAdmin, addOrder) // WITH AUTH
router.post('/', addOrder)
// router.post('/:id/review', requireAuth, addReview) // WITH AUTH
router.post('/:id/review', addReview)
// router.put('/:id', requireAuth, requireAdmin, updateOrder) // WITH AUTH
router.put('/:id', updateOrder)
// router.delete('/:id', requireAuth, requireAdmin, deleteOrder) // WITH AUTH
router.delete('/:id', deleteOrder)

module.exports = router
