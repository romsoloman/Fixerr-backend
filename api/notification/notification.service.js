const dbService = require('../../services/db.service');
const ObjectId = require('mongodb').ObjectId;

async function query(currentUserId) {
  try {
    console.log(1);
    const notificationCollection = await dbService.getCollection('notification');
    const gigCollection = await dbService.getCollection('gig');
    const userCollection = await dbService.getCollection('user');
    // console.log('currentUserId', currentUserId);
    console.log(2);

    const notificationForCurrentUser = await notificationCollection.find({ likedGigOwnerId: currentUserId }).toArray();
    const notificationsToReturn = [];
    console.log(3);

    for (const currNotification of notificationForCurrentUser) {
      console.log(4);
      const likedGig = await gigCollection.findOne({ _id: ObjectId(currNotification.likedGigId) });
      // console.log('liked', likedGig);
      const userThatLiked = await userCollection.findOne({ _id: ObjectId(currNotification.userThatLikedId) });

      console.log(5);
      console.log('currNotification', currNotification);
      console.log('currNotification._id', currNotification._id);
      notificationsToReturn.push({
        likedGig,
        userThatLiked,
        _id: currNotification._id
      });

      // const likeCriteria = { likedGigId: currGig._id.toString(), userThatLikedId: currentUserId.toString() }
      // const likedGigs = await likesCollection.find(likeCriteria).toArray()
      // if (likedGigs && likedGigs.length > 0) {
      //   newGigsArray.push({ ...currGig, isLike: true });
      // } else {
      //   newGigsArray.push(currGig);
      // }
    };
    // notificationForCurrentUser.map()
    console.log(6);
    // console.log(3);
    return notificationsToReturn;
  } catch (err) {
    logger.error('cannot find notifications', err)
    throw err
  }
}

async function add(likedGig) {
  try {
    const collection = await dbService.getCollection('notification');
    await collection.insertOne({ likedGigId: likedGig._id, userThatLikedId: JSON.parse(likedGig.currUser)._id, likedGigOwnerId: likedGig.creator._id });
    return likedGig;
  } catch (err) {
    console.log('err', err);
    logger.error('cannot insert notification', err)
    throw err
  }
}

module.exports = {
  query,
  // remove,
  add
}
