const express = require('express')
const { getToys, getToyById, addToy, updateToy, removeToy } = require('./toy.controller')
const { log } = require('../../middlewares/logger.middleware')
const { requireAdmin, requireAuth } = require('../../middlewares/requireAuth.middleware')
const router = express.Router()


router.get('/',log, getToys)
router.get('/:id', getToyById)
router.post('/', requireAuth, requireAdmin, addToy)
router.put('/:id', requireAuth, updateToy)
router.delete('/:id', requireAuth, requireAdmin, removeToy)



module.exports = router