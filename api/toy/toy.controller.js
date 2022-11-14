const toyService = require('./toy.service.js');
const logger = require('../../services/logger.service')

// GET LIST
async function getToys(req, res) {
    try {
        logger.debug('Getting Toys')
        let filterBy = req.query

        if (!filterBy.labels ||
            filterBy.labels === 'undefined' ||
            filterBy.labels?.length === 7 ||
            filterBy.labels?.includes('all')) {
            filterBy.labels = []
        }
        if (!filterBy.inStock || filterBy.inStock === 'undefined') filterBy.inStock = 'all'
        if (!filterBy.name || filterBy.name === 'undefined') filterBy.name = ''
        if (!filterBy.sortBy || filterBy.sortBy === 'undefined') filterBy.sortBy = 'created'

        const toys = await toyService.query(filterBy)
        res.json(toys);
    } catch (err) {
        logger.error('Failed to get toys', err)
        res.status(500).send({ err: 'Failed to get toys' })
    }
}

// GET BY ID 
async function getToyById(req, res) {
    try {
        const toyId = req.params.id
        const toy = await toyService.getById(toyId)
        res.json(toy)
    } catch (err) {
        logger.error('Failed to get toy', err)
        res.status(500).send({ err: 'Failed to get toy' })
    }
}

// POST (add toy)
async function addToy(req, res) {
    try {
        const toy = req.body
        const addedToy = await toyService.add(toy)
        res.json(addedToy)
    } catch (err) {
        logger.error('Failed to add toy', err)
        res.status(500).send({ err: 'Failed to add toy' })
    }
}

// PUT (Update toy)
async function updateToy(req, res) {
    try {
        const toy = req.body;
        const updatedToy = await toyService.update(toy)
        console.log(updatedToy)
        res.json(updatedToy)
    } catch (err) {
        logger.error('Failed to update toy', err)
        res.status(500).send({ err: 'Failed to update toy' })

    }
}

// DELETE (Remove toy)
async function removeToy(req, res) {
    try {
        const toyId = req.params.id
        const removedId = await toyService.remove(toyId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove toy', err)
        res.status(500).send({ err: 'Failed to remove toy' })
    }
}


module.exports = {
    getToys,
    getToyById,
    addToy,
    updateToy,
    removeToy
}
