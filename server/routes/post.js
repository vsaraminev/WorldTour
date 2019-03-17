const express = require('express')
const authCheck = require('../config/auth-check')
const Tour = require('../models/Tour')
const Post = require('../models/Post')

const router = new express.Router()

function validatePostForm(payload) {
    const errors = {}
    let isFormValid = true
    let message = ''


    if (!payload || typeof payload.content !== 'string' || payload.content.length < 3 || payload.content.length > 200) {
        isFormValid = false
        errors.content = 'Content must be at least 3 symbols and less than 200 symbols.'
    }

    if (!payload || !payload.createdBy || typeof payload.createdBy !== 'string') {
        isFormValid = false
        errors.createdBy = 'Invalid userId.'
    }

    if (!payload || !payload.tourId || typeof payload.tourId !== 'string') {
        isFormValid = false
        errors.tourId = 'Invalid tourId.'
    }

    if (!isFormValid) {
        message = 'Check the form for errors.'
    }

    return {
        success: isFormValid,
        message,
        errors
    }
}

router.post('/create', authCheck, async (req, res) => {
    const postObj = req.body
    if (req.user.roles.indexOf('User') > -1) {
        const validationResult = validatePostForm(postObj)
        var user = req.user;
        if (!user) {
            return res.status(200).json({
                success: false,
                message: "There is no user with these credentials"
            })
        }
        if (!validationResult.success) {
            return res.status(200).json({
                success: false,
                message: validationResult.message,
                errors: validationResult.errors
            })
        }

        const postToCreate = postObj;
        const tourCommented = await Tour.findById(postObj.tourId);
        postToCreate.tourId = tourCommented._id;

        Post
            .create(postToCreate)
            .then(async (createdPost) => {
                res.status(200).json({
                    success: true,
                    message: 'Comment added successfully.',
                    data: createdPost
                })
                await tourCommented.posts.push(createdPost.id);
                await tourCommented.save();
            })
            .catch((err) => {
                console.log(err)
                let message = 'Something went wrong :( Check the form for errors.'
                if (err.code === 11000) {
                    message = 'Post with the given name already exists.'
                }
                return res.status(200).json({
                    success: false,
                    message: message
                })
            })
    } else {
        return res.status(200).json({
            success: false,
            message: 'Invalid credentials!'
        })
    }
})

router.get('/allByTour/:id', (req, res) => {
    const tourId = req.params.id
    Post
        .find({ tourId: tourId })
        .then(posts => {
            res.status(200).json({ posts: posts })
        })
        .catch((err) => {
            console.log(err)
            const message = 'Something went wrong :('
            return res.status(200).json({
                success: false,
                message: message
            })
        })
})

module.exports = router