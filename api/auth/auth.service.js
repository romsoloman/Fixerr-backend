const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')


async function login(username, password) {
    logger.debug(`auth.service - login with username: ${username}`)

    const user = await userService.getByUsername(username)
    if (!user) return Promise.reject('Invalid username or password')
    // TODO: un-comment for real login
    const match = await bcrypt.compare(password, user.password)
    if (!match) return Promise.reject('Invalid username or password')

    delete user.password
    return user
}

async function signup(username, password, fullname) {
    const saltRounds = 10

    logger.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`)
    if (!username || !password || !fullname) return Promise.reject('fullname, username and password are required!')

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({ username, password: hash, fullname, location: "Israel", memberSince: Date.now(), avgResponseTime: `${parseInt(Math.random() * 7) + 1} Hours`, lastDelivery: `About ${parseInt(Math.random() * 7) + 1} Hours`, imgUrl: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixid=MXwxMjA3fDB8MHxzZWFyY2h8OHx8bWFufGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', level: 1 })
}

module.exports = {
    signup,
    login,
}