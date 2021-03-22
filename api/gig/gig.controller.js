const gigService = require('./gig.service')
const logger = require('../../services/logger.service')

async function getGig(req, res) {
    try {
        const gig = await gigService.getById(req.params.id)
        res.send(gig)
    } catch (err) {
        logger.error('Failed to get gig', err)
        res.status(500).send({ err: 'Failed to get gig' })
    }
}

async function getGigs(req, res) {
    try {
        const filterBy = req.body
        const gigs = await gigService.query(filterBy)
        res.send(gigs)
    } catch (err) {
        logger.error('Failed to get gigs', err)
        res.status(500).send({ err: 'Failed to get gigs' })
    }
}

async function deleteGig(req, res) {
    try {
        await gigService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete gig', err)
        res.status(500).send({ err: 'Failed to delete gig' })
    }
}

async function addGig(req, res) {
    try {
        const gig = req.body;
        const savedGig = await gigService.add(gig)
        res.send(savedGig)
    } catch (err) {
        logger.error('Failed to add gig', err)
        res.status(500).send({ err: 'Failed to add gig' })
    }
}

async function updateGig(req, res) {
    try {
        const gig = req.body
        const savedGig = await gigService.update(gig)
        res.send(savedGig)
    } catch (err) {
        logger.error('Failed to update gig', err)
        res.status(500).send({ err: 'Failed to update gig' })
    }
}



module.exports = {
    getGig,
    getGigs,
    addGig,
    deleteGig,
    updateGig
}