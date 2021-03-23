
const dbService = require('../../services/db.service')
// const logger = require('../../services/logger.service')
const reviewService = require('../review/review.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    getByGigName,
    remove,
    update,
    add
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('gig')
        // var gigs = await collection.find(criteria).toArray()
        var gigs = await collection.find({}).toArray();
        // gigs = gigs.map(gig => {
        //     gig.inStock = true
        //     gig.createdAt = ObjectId(gig._id).getTimestamp()
        //     // Returning fake fresh data
        //     // gig.createdAt = Date.now() - (1000 * 60 * 60 * 24 * 3) // 3 days ago
        //     return gig
        // })
        return gigs
    } catch (err) {
        logger.error('cannot find gigs', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection('gig')
        const gig = await collection.findOne({ 'creator._id': ObjectId(userId) })
        return gig
    } catch (err) {
        logger.error(`while finding gig ${userId}`, err)
        throw err
    }
}
async function getByGigName(gigName) {
    try {
        const collection = await dbService.getCollection('gig')
        const gig = await collection.findOne({ gigName })
        return gig
    } catch (err) {
        logger.error(`while finding gig ${gigName}`, err)
        throw err
    }
}

async function remove(gigId) {
    try {
        const collection = await dbService.getCollection('gig')
        await collection.deleteOne({ '_id': ObjectId(gigId) })
    } catch (err) {
        logger.error(`cannot remove gig ${gigId}`, err)
        throw err
    }
}

async function update(gig) {
    try {
        // peek only updatable fields!
        const gigToSave = {
            _id: ObjectId(gig._id),
            title: gig.title,
            price: gig.price,
            rating: gig.rating,
            about: gig.about,
            deliveryTime: gig.deliveryTime,
            tags: gig.tags,
            extras: [
                "Source File",
                "Logo Transparency",
                "3D Mockup",
                "Vector File"
            ],
            creator: gig.creator,
            imgUrls: gig.imgUrls,
            reviews: gig.reviews,
            createdAt: Date.now(),
        }
        const collection = await dbService.getCollection('gig')
        await collection.updateOne({ '_id': gigToSave._id }, { $set: gigToSave })
        return gigToSave;
    } catch (err) {
        logger.error(`cannot update gig ${gig._id}`, err)
        throw err
    }
}

async function add(gig) {
    const gigToSave = {
        title: gig.title,
        price: gig.price,
        rating: gig.rating,
        about: gig.about,
        deliveryTime: gig.deliveryTime,
        tags: gig.tags,
        extras: [
            "Source File",
            "Logo Transparency",
            "3D Mockup",
            "Vector File"
        ],
        creator: gig.creator,
        reviews: gig.reviews,
        imgUrls: gig.imgUrls,
        createdAt: Date.now(),
    }
    gigToSave.creator._id = ObjectId(gigToSave.creator._id)
    const collection = await dbService.getCollection('gig')
    await collection.insertOne({ ...gigToSave })
    return gigToSave;
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                name: txtCriteria
            },
        ]
    }
    if (filterBy.type) {
        // criteria.type = { $gte: filterBy.minBalance }
    }
    return criteria
}

