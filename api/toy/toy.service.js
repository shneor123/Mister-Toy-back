const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

const PAGE_SIZE = 8


const COLLECTION_NAME = 'toy'



async function query(filterBy) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection(COLLECTION_NAME)

        let { sortBy ,pageIdx } = filterBy
        let sortType = 1
        if (!sortBy || sortBy === 'created') {
            sortBy = 'createdAt'
            sortType = -1
        }
        let toys = await collection.find(criteria).sort({ [sortBy]: sortType }).toArray()
        return toys
    } catch (err) {
        logger.error('cannot find toys', err)
        throw err
    }
}


// async function query(filterBy) {
//     try {
//         const criteria = _buildCriteria(filterBy)
//         const collection = await dbService.getCollection(COLLECTION_NAME)
//         let toys = await collection.find(criteria)
//         let { sortBy ,pageIdx } = filterBy
//         if (sortBy) toys.collation({ locale: 'en' }).sort({ [sortBy]: 1 })
//         toys = await toys.toArray()
        
//         if (toys.length > PAGE_SIZE) {
//             const startIdx = toys.length > (PAGE_SIZE * pageIdx) ? pageIdx * PAGE_SIZE : 0
//             toys = toys.slice(startIdx, startIdx + PAGE_SIZE)
//         }
//         return toys
//     } catch (err) {
//         logger.error('cannot find toys', err)
//         throw err
//     }
// }

// GET_BY_ID (GetById toy)
async function getById(toyId) {
    try {
        const collection = await dbService.getCollection(COLLECTION_NAME)
        const toy = await collection.findOne({ _id: ObjectId(toyId) })
        return toy
    } catch (err) {
        logger.error(`while finding toy ${toyId}`, err)
        throw err
    }
}

// DELETE (Remove toy)
async function remove(toyId) {
    try {
        const collection = await dbService.getCollection(COLLECTION_NAME)
        await collection.deleteOne({ _id: ObjectId(toyId) })
        return toyId
    } catch (err) {
        logger.error(`cannot remove toy ${toyId}`, err)
        throw err
    }
}

// ADD (Add toy)
async function add(toy) {
    try {
        const collection = await dbService.getCollection(COLLECTION_NAME)
        const addedToy = await collection.insertOne(toy)
        return addedToy
    } catch (err) {
        logger.error('cannot insert toy', err)
        throw err
    }
}

// UPDATE (Update toy)
async function update(toy) {
    try {
        var id = ObjectId(toy._id)
        delete toy._id
        const collection = await dbService.getCollection(COLLECTION_NAME)
        await collection.updateOne({ _id: id }, { $set: { ...toy } })
        return toy
    } catch (err) {
        logger.error(`cannot update toy ${toyId}`, err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.name) {
        criteria.name = { $regex: filterBy.name, $options: 'i' }
    }
    if (filterBy.inStock && filterBy.inStock !== 'all') {
        criteria.inStock = JSON.parse(filterBy.inStock)
    }

    if (filterBy.labels?.length) {
        const labels = filterBy.labels.split(',')
        criteria.labels = { $all: labels }
    }
    return criteria
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}
