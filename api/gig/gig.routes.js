const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getGig, getGigs, deleteGig, updateGig, addGig } = require('./gig.controller')
const { addReview, getReviews, deleteReview } = require('../review/review.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getGigs)
router.get('/:id', getGig)
router.get('/:id/review', getReviews)
// router.post('/', requireAuth, requireAdmin, addGig) // WITH AUTH 
router.post('/', addGig)
// router.post('/:id/review', requireAuth, addReview) // WITH AUTH
router.post('/:id/review', addReview)
// router.put('/:id', requireAuth, requireAdmin, updateGig) // WITH AUTH
router.put('/:id', updateGig)
// router.delete('/:id', requireAuth, requireAdmin, deleteGig) // WITH AUTH
router.delete('/:id', deleteGig)

module.exports = router