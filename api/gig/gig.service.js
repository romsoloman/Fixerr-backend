
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
    add,
    getByUserId,
}

async function query(filterBy = {}, currentUserId) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('gig')
        const gigs = await collection.find(criteria).sort({ _id: -1 }).toArray();
        console.log('gigs.length', gigs.length);
        if (!currentUserId) {
            return gigs;
        }
        const likesCollection = await dbService.getCollection('like');
        const newGigsArray = [];
        for (const currGig of gigs) {
            const likeCriteria = { likedGigId: currGig._id.toString(), userThatLikedId: currentUserId.toString() }
            const likedGigs = await likesCollection.find(likeCriteria).toArray()
            if (likedGigs && likedGigs.length > 0) {
                newGigsArray.push({ ...currGig, currUserLikedThisGig: true });
            } else {
                newGigsArray.push(currGig);
            }

        };
        return newGigsArray;
    } catch (err) {
        console.log('err', err);
        logger.error('cannot find gigs', err)
        throw err
    }
}

async function getById(gigId) {
    try {
        const collection = await dbService.getCollection('gig')
        const gig = await collection.findOne({ '_id': ObjectId(gigId) })
        return gig
    } catch (err) {
        logger.error(`while finding gig ${gigId}`, err)
        throw err
    }
}
async function getByUserId(userId) {
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
            price: +gig.price,
            rating: +gig.rating,
            about: gig.about,
            deliveryTime: +gig.deliveryTime,
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
    if (filterBy.name) {
        var nameCriteria = filterBy.name.toLowerCase()
    }
    if (filterBy.price) {
        const price = JSON.parse(filterBy.price)
        criteria.price = {};
        if (price.minPrice) {
            var minPriceCriteria = price.minPrice;
            criteria.price = { $gte: minPriceCriteria }
        }
        if (price.maxPrice) {
            var maxPriceCriteria = price.maxPrice;
            criteria.price = { ...criteria.price, $lte: maxPriceCriteria }
        }
    }
    if (filterBy.rating) {
        var ratingCriteria = +filterBy.rating
        // criteria.rating = { $eq: ratingCriteria }
    }
    if (filterBy.level) {
        var levelCriteria = +filterBy.level
        // criteria["creator.level"] = { $eq: levelCriteria }

    }
    console.log('nameCriteria', nameCriteria);
    criteria.$or = [
        {
            tags: nameCriteria
        },
        {
            rating: ratingCriteria
        },
        {
            level: levelCriteria
        }
    ]
    console.log('criteria', criteria);
    return criteria
}
