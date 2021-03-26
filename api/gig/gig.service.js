
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
    console.log('criteria - ODED!!!', criteria);
    try {
        const collection = await dbService.getCollection('gig')
        const likesCollection = await dbService.getCollection('like');
        const gigs = await collection.find(criteria).sort({ _id: -1 }).toArray();
        console.log('currentUserId', ObjectId(currentUserId));
        const newGigsArray = [];

        // gigs.forEach(async (element, index) => {
        for (const currGig of gigs) {
            console.log('currGig._id', ObjectId(currGig._id));
            // const likeForThisGigByCurrentUser = await likesCollection.find({}).toArray();
            // const likeForThisGigByCurrentUser = await likesCollection.findOne({ 'likedGigId': ObjectId(currGig._id), 'userThatLikedId': ObjectId(currentUserId) });
            // const likeForThisGigByCurrentUser = await likesCollection.find({ likedGigId: '605b2541823dcb6209216127', userThatLikedId: '6059c99124c4d138693b3105' }).toArray();
            const likeForThisGigByCurrentUser2 = await likesCollection.find({ likedGigId: currGig._id.toString(), userThatLikedId: currentUserId.toString() }).toArray();
            // console.log('likeForThisGigByCurrentUser', likeForThisGigByCurrentUser);
            if (likeForThisGigByCurrentUser2 && likeForThisGigByCurrentUser2.length > 0) {
                // console.log('index', index);
                console.log('likeForThisGigByCurrentUser2', likeForThisGigByCurrentUser2);
                console.log('likeForThisGigByCurrentUser2.length', likeForThisGigByCurrentUser2.length);
                // gigs[index].currUserLikedThisGig = likeForThisGigByCurrentUser2.length === 1;
                newGigsArray.push({ ...currGig, currUserLikedThisGig: likeForThisGigByCurrentUser2.length > 0 });
                // currGig.currUserLikedThisGig = likeForThisGigByCurrentUser2.length === 1;
            } else {
                newGigsArray.push(currGig);
            }
            // gigs[index].currUserLikedThisGig = likeForThisGigByCurrentUser2.length === 1;
            // gigs[index].currUserLikedThisGig2 = 'elior!!';
        };
        // });
        // var gigs = await collection.find({}).sort({ _id: -1 }).toArray()
        // gigs = gigs.map(gig => {
        //     gig.inStock = true
        //     gig.createdAt = ObjectId(gig._id).getTimestamp()
        //     // Returning fake fresh data
        //     // gig.createdAt = Date.now() - (1000 * 60 * 60 * 24 * 3) // 3 days ago
        //     return gig
        // })
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
        const nameCriteria = filterBy.name.toLowerCase()
        criteria.$or = [
            {
                tags: nameCriteria
            },
        ]
    }
    if (filterBy.price) {
        const price = JSON.parse(filterBy.price)
        criteria.price = {};
        if (price.minPrice) {
            const minPriceCriteria = price.minPrice;
            criteria.price = { $gte: minPriceCriteria }
        }
        if (price.maxPrice) {
            const maxPriceCriteria = price.maxPrice;
            criteria.price = { ...criteria.price, $lte: maxPriceCriteria }
        }
    }
    if (filterBy.rating) {
        const ratingCriteria = +filterBy.rating
        criteria.rating = { $eq: ratingCriteria }
    }
    if (filterBy.level) {
        const levelCriteria = +filterBy.level
        criteria["creator.level"] = { $eq: levelCriteria }

    }
    return criteria
}
