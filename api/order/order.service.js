
const dbService = require('../../services/db.service')
// const logger = require('../../services/logger.service')
const reviewService = require('../review/review.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    getByOrderName,
    remove,
    update,
    add
}

async function query(criteria) {
    try {
        const collection = await dbService.getCollection('order')
        var orders = await collection.find({ "seller._id": ObjectId(criteria) }).toArray()
        return orders
    } catch (err) {
        logger.error('cannot find orders', err)
        throw err
    }
}

async function getById(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        const order = await collection.findOne({ '_id': ObjectId(orderId) })
        return order
    } catch (err) {
        logger.error(`while finding order ${orderId}`, err)
        throw err
    }
}
async function getByOrderName(orderName) {
    try {
        const collection = await dbService.getCollection('order')
        const order = await collection.findOne({ orderName })
        return order
    } catch (err) {
        logger.error(`while finding order ${orderName}`, err)
        throw err
    }
}

async function remove(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.deleteOne({ '_id': ObjectId(orderId) })
    } catch (err) {
        logger.error(`cannot remove order ${orderId}`, err)
        throw err
    }
}

async function update(order) {
    try {
        // peek only updatable fields!
        const orderToSave = {
            _id: order._id,
            createdAt: Date.now(),
            buyer: order.buyer,
            totalPrice: +order.totalPrice,
            seller: order.seller,
            deliveryTime: order.deliveryTime,
            items: order.items,
            extras: order.extras,
            status: order.status
        }
        const collection = await dbService.getCollection('order')
        await collection.updateOne({ '_id': orderToSave._id }, { $set: orderToSave })
        return orderToSave;
    } catch (err) {
        logger.error(`cannot update order ${order._id}`, err)
        throw err
    }
}

async function add(order) {
    const orderToSave = {
        createdAt: order.createdAt,
        buyer: order.buyer,
        totalPrice: +order.totalPrice,
        seller: order.seller,
        deliveryTime: parseInt(Math.random() * 12) + 1,
        items: order.items,
        tags: order.tags,
        extras: [
            "Source File",
            "Logo Transparency",
            "3D Mockup",
            "Vector File"
        ],
        status: "pending"
    }
    orderToSave.buyer._id = ObjectId(orderToSave.buyer._id)
    orderToSave.seller._id = ObjectId(orderToSave.seller._id)
    const collection = await dbService.getCollection('order')
    await collection.insertOne({ ...orderToSave })
    return orderToSave;
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
