const express = require('express');
const authCheck = require('../config/auth-check');
const Tour = require('../models/Tour');
const User = require('../models/User');

const router = new express.Router()

function validatePostCreateForm(payload) {
    console.log(payload);
    const errors = {}
    let isFormValid = true
    let message = ''


    if (!payload || typeof payload.title !== 'string' || payload.title.length < 3 || payload.title.length > 50) {
        isFormValid = false
        errors.title = 'Tour title must be at least 3 symbols and less than 50 symbols.'
    }

    if (!payload || typeof payload.country !== 'string' || payload.country.length < 3 || payload.country.length > 50) {
        isFormValid = false
        errors.country = 'Country must be at least 3 symbols and less than 50 symbols.'
    }

    // if (!payload || typeof payload.description !== 'string' || payload.description.length < 5 || payload.description.length > 120) {
    //     isFormValid = false
    //     errors.description = 'Description must be at least 5 symbols and less than 120 symbols.'
    // }

    if (!payload || typeof payload.image !== 'string' || !(payload.image.startsWith('https://') || payload.image.startsWith('http://')) || payload.image.length < 14) {
        isFormValid = false
        errors.image = 'Please enter valid Image URL. Image URL must be at least 14 symbols.'
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
    const tourObj = req.body
    if (req.user.roles.indexOf('User') > -1) {
        const validationResult = validatePostCreateForm(tourObj)
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

        let tourToCreate = tourObj;

        Tour
            .create(tourToCreate)
            .then(async (createdTour) => {
                res.status(200).json({
                    success: true,
                    message: 'Tour created successfully.',
                    data: createdTour
                })
                user.tours.push(createdTour._id);
                await user.save();
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

router.post('/edit/:id', authCheck, async (req, res) => {
    if (req.user.roles.indexOf('User') > -1) {
        const tourId = req.params.id;
        const tourBody = req.body;
        let tourObj = tourBody;
        const validationResult = validatePostCreateForm(tourObj)
        if (!validationResult.success) {
            return res.status(200).json({
                success: false,
                message: validationResult.message,
                errors: validationResult.errors
            })
        }
        try {
            let existingTour = await Tour.findById(tourId)

            existingTour.title = tourObj.title
            existingTour.country = tourObj.country
            existingTour.image = tourObj.image
            existingTour.description = tourObj.description
            existingTour.price = tourObj.price

            existingTour
                .save()
                .then(editedTour => {
                    res.status(200).json({
                        success: true,
                        message: 'Tour edited successfully.',
                        data: editedTour
                    })
                })
                .catch((err) => {
                    console.log(err)
                    let message = 'Something went wrong :( Check the form for errors.'
                    if (err.code === 11000) {
                        message = 'Tour with the given name already exists.'
                    }
                    return res.status(200).json({
                        success: false,
                        message: message
                    })
                })
        } catch (error) {
            console.log(err)
            const message = 'Something went wrong :( Check the form for errors.'
            return res.status(200).json({
                success: false,
                message: message
            })
        }
    } else {
        return res.status(200).json({
            success: false,
            message: 'Invalid credentials!'
        })
    }
})

router.get('/', (req, res) => {
    Tour
        .find()
        .then(tours => {
            res.status(200).json({ tours })
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

router.get('/details/:id', (req, res) => {
    const id = req.params.id
    Tour
        .findById(id)
        .populate('User')
        .then(tour => {
            if (!tour) {
                const message = 'Tour not found.'
                return res.status(200).json({
                    success: false,
                    message: message
                })
            }

            return res.status(200).json({
                success: true,
                message: 'Tour details info.',
                tour: tour,
                createdBy: tour.createdBy,
                //starsCount: tour.stars.length,
                stars: tour.stars,
            })
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

router.delete('/remove/:id', authCheck, async (req, res) => {
    const id = req.params.id;
    const creator = req.body.creatorId;
    var user = await User.findById(creator);
    if (req.user.roles.indexOf('User') > -1 || req.user.roles.indexOf('Admin') > -1) {
        Tour
            .findById(id)
            .then(async (tour) => {
                let tourTitle = tour.title;
                try {
                    let filteredTours = user.tours.filter(t => t.toString() !== id.toString());
                    user.tours = filteredTours
                    await user.save();
                } catch (error) {
                    console.log(error)
                }

                let creatorPossible = req.user._id;
                if (creatorPossible.toString() === tour.createdBy.toString() || req.user.roles.includes('Admin')) {
                    Tour
                        .findByIdAndDelete(id)
                        .then(() => {
                            return res.status(200).json({
                                success: true,
                                message: `Tour "${tourTitle}" deleted successfully!`
                            })
                        })
                        .catch((err) => {
                            console.log(err)
                            const message = 'Something went wrong :('
                            return res.status(200).json({
                                success: false,
                                message: message
                            })
                        })

                }

            })
            .catch(() => {
                return res.status(200).json({
                    success: false,
                    message: 'Entry does not exist!'
                })
            })
    } else {
        return res.status(200).json({
            success: false,
            message: 'Invalid credentials!'
        })
    }
})

module.exports = router