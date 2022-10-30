const userService = require('./user.service')
const logger = require('../../services/logger.service')

async function getUser(req, res) {
    try {
        const user = await userService.getById(req.params.id)
        res.send(user)
    } catch (err) {
        logger.error('Failed to get user', err)
        res.status(500).send({ err: 'Failed to get user' })
    }
}

async function getUsers(req, res) {
    try {
        const filterBy = {
            txt: req.query?.txt || '',
        }
        const users = await userService.query(filterBy)
        res.send(users)
    } catch (err) {
        logger.error('Failed to get users', err)
        res.status(500).send({ err: 'Failed to get users' })
    }
}

// async function deleteUser(req, res) {
//     try {
//         logger.debug('Deleting user',)
//         await userService.remove(req.params.id)
//         res.send({ msg: 'Deleted successfully' })
//     } catch (err) {
//         logger.error('Failed to delete user', err)
//         res.status(500).send({ err: 'Failed to delete user' })
//     }
// }


// DELETE (Remove user)
async function deleteUser(req, res) {
    try {
        logger.debug('Deleting user',)
        const userId = req.params.id
        const removedId = await userService.remove(userId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove toy', err)
        res.status(500).send({ err: 'Failed to remove toy' })
    }
}


// async function deleteUser(req, res) {
//     try {
//         logger.debug('Deleting user',)
//         const deletedCount = await userService.remove(req.params.id)
//         if (deletedCount === 1) {
//             res.send({ msg: 'Deleted successfully' })
//         } else {
//             res.status(400).send({ err: 'Cannot remove review' })
//         }
//     } catch (err) {
//         logger.error('Failed to delete review', err)
//         res.status(500).send({ err: 'Failed to delete revfuiew' })
//     }
// }

async function updateUser(req, res) {
    try {
        const user = req.body
        const savedUser = await userService.update(user)
        res.send(savedUser)
    } catch (err) {
        logger.error('Failed to update user', err)
        res.status(500).send({ err: 'Failed to update user' })
    }
}

module.exports = {
    getUser,
    getUsers,
    deleteUser,
    updateUser
}