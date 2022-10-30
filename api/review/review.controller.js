const logger = require('../../services/logger.service')
const toyService = require('../toy/toy.service')
const authService = require('../auth/auth.service')
const reviewService = require('./review.service')

async function getReviews(req, res) {
    try {
        const reviews = await reviewService.query(req.query)
        res.send(reviews)
    } catch (err) {
        logger.error('Cannot get reviews', err)
        res.status(500).send({ err: 'Failed to get reviews' })
    }
}

// GET BY ID 
async function getReviewById(req, res) {
    try {
        const reviewId = req.params.id;
        const review = await reviewService.getById(reviewId)
        res.json(review)
    } catch (err) {
        logger.error('Failed to get review', err)
        res.status(500).send({ err: 'Failed to get review' })
    }
}


async function deleteReview(req, res) {
    try {
        const deletedCount = await reviewService.remove(req.params.id)
        if (deletedCount === 1) {
            res.send({ msg: 'Deleted successfully' })
        } else {
            res.status(400).send({ err: 'Cannot remove review' })
        }
    } catch (err) {
        logger.error('Failed to delete review', err)
        res.status(500).send({ err: 'Failed to delete revfuiew' })
    }
}


async function addReview(req, res) {

    var loggedinUser = authService.validateToken(req.cookies.loginToken)

    try {
        var review = req.body
        review.byUserId = loggedinUser._id
        review = await reviewService.add(review)

        // prepare the updated review for sending out
        review.aboutToy = await toyService.getById(review.toyId)
        // loggedinUser = await userService.update(loggedinUser) // if user get credit score for adding a review
        review.byUser = loggedinUser

        // User info is saved also in the login-token, update it
        const loginToken = authService.getLoginToken(loggedinUser)
        res.cookie('loginToken', loginToken)

        const fullUser = await userService.getById(loggedinUser._id)
        socketService.broadcast({type: 'review-added', data: review, userId: review.byUserId})
        socketService.emitToUser({type: 'review-about-you', data: review, userId: review.aboutUserId})
        socketService.emitTo({type: 'user-updated', data: fullUser, label: fullUser._id})

        res.send(review)
    } catch (err) {
        console.log(err)
        logger.error('Failed to add review', err)
        res.status(500).send({ err: 'Failed to add review' })
    }
}

module.exports = {
    getReviews,
    deleteReview,
    addReview,
    getReviewById
}