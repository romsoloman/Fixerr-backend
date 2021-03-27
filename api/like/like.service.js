const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query() {
    try {
        const collection = await dbService.getCollection('like')
        var likes = await collection.find().toArray()
        return likes
    } catch (err) {
        logger.error('cannot find orders', err)
        throw err
    }
}

async function remove(likeId) {
    try {
        // const store = asyncLocalStorage.getStore()
        // const { userId, isAdmin } = store
        const collection = await dbService.getCollection('like')
        // remove only if user is owner/admin
        const query = { _id: ObjectId(likeId) }
        // if (!isAdmin) query.byUserId = ObjectId(userId)
        await collection.deleteOne(query)
        // return await collection.deleteOne({ _id: ObjectId(likeId), byUserId: ObjectId(userId) })
    } catch (err) {
        logger.error(`cannot remove like ${likeId}`, err)
        throw err
    }
}


async function add(likedGig) {
    try {
        const collection = await dbService.getCollection('like')
        await collection.insertOne({ likedGigId: likedGig._id, userThatLikedId: JSON.parse(likedGig.currUser)._id });
        return likedGig;
    } catch (err) {
        console.log('err', err);
        logger.error('cannot insert like', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    return criteria
}

module.exports = {
    query,
    remove,
    add
}
