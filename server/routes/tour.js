const express = require('express');
const authCheck = require('../config/auth-check');
const Book = require('../models/Book');
const Tour = require('../models/Tour');
const Post = require('../models/Post');
const User = require('../models/User');
const Category = require('../models/Category');

const router = new express.Router()

function validatePostCreateForm(payload) {
    const errors = {}
    let isFormValid = true
    let message = ''


    if (!payload || typeof payload.title !== 'string' || payload.title.length < 3 || payload.title.length > 50) {
        isFormValid = false
        errors.title = 'Post title must be at least 3 symbols and less than 50 symbols.'
    }

    if (!payload || typeof payload.country !== 'string' || payload.country.length < 3 || payload.country.length > 50) {
        isFormValid = false
        errors.country = 'Country must be at least 3 symbols and less than 50 symbols.'
    }

    if (!payload || typeof payload.description !== 'string' || payload.description.length < 5 || payload.description.length > 120) {
        isFormValid = false
        errors.description = 'Description must be at least 5 symbols and less than 120 symbols.'
    }

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
    if (req.user.roles.indexOf('Admin') > -1) {
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
        const postId = req.params.id;
        const postBody = req.body;
        let postObj = postBody;
        let category = await Category.findOne({ name: postObj.category });
        postObj.category = category.name;
        const validationResult = validatePostCreateForm(postObj)
        if (!validationResult.success) {
            return res.status(200).json({
                success: false,
                message: validationResult.message,
                errors: validationResult.errors
            })
        }
        try {
            let existingPost = await Post.findById(postId)
            if (existingPost && existingPost.category !== postObj.category) {
                let prevCategory = await Category.findOne({ name: existingPost.category })
                prevCategory.posts = prevCategory.posts.filter(p => p !== existingPost._id)
                await prevCategory.save();

                let currCategory = await Category.findOne({ name: postObj.category })
                prevCategory.posts = prevCategory.posts.push(existingPost._id)
                await currCategory.save();
            }


            existingPost.title = postObj.title
            existingPost.content = postObj.content
            existingPost.imageUrl = postObj.imageUrl
            existingPost.category = postObj.category

            existingPost
                .save()
                .then(editedPost => {
                    res.status(200).json({
                        success: true,
                        message: 'Post edited successfully.',
                        data: editedPost
                    })
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

router.get('/latest', (req, res) => {
    Post
        .find()
        .then(posts => {
            let latestPost = posts.sort((a, b) => {
                return a.createdOn < b.createdOn
            })[0]
            res.status(200).json(latestPost)
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

// router.post('/review/:id', authCheck, (req, res) => {
//   const id = req.params.id
//   const review = req.body.review
//   const username = req.user.username

//   if (review.length < 4) {
//     const message = 'Review must be at least 4 characters long.'
//     return res.status(200).json({
//       success: false,
//       message: message
//     })
//   }

//   Book
//     .findById(id)
//     .then(book => {
//       if (!book) {
//         return res.status(200).json({
//           success: false,
//           message: 'Product not found.'
//         })
//       }

//       let reviewObj = {
//         review,
//         createdBy: username
//       }

//       let reviews = book.reviews
//       reviews.push(reviewObj)
//       book.reviews = reviews
//       book
//         .save()
//         .then((book) => {
//           res.status(200).json({
//             success: true,
//             message: 'Review added successfully.',
//             data: book
//           })
//         })
//         .catch((err) => {
//           console.log(err)
//           const message = 'Something went wrong :( Check the form for errors.'
//           return res.status(200).json({
//             success: false,
//             message: message
//           })
//         })
//     })
//     .catch((err) => {
//       console.log(err)
//       const message = 'Something went wrong :( Check the form for errors.'
//       return res.status(200).json({
//         success: false,
//         message: message
//       })
//     })
// })

router.post('/star/:id', authCheck, async (req, res) => {
    const id = req.params.id
    const userId = req.user.id

    Post
        .findById(id)
        .then(post => {
            if (!post) {
                const message = 'Post not found.'
                return res.status(200).json({
                    success: false,
                    message: message
                })
            }

            let stars = post.stars;
            let message = '';
            if (stars.includes(userId)) {
                const index = stars.indexOf(req.user.id)
                stars.splice(index, 1)
                message = 'Post unstar successfully.'
            } else {
                stars.push(userId)
                message = 'Post recieved star successfully.'
            }
            post.stars = stars
            post
                .save()
                .then(async (likedPost) => {
                    let user = await User.findById(likedPost.createdBy._id)
                    res.status(200).json({
                        success: true,
                        message: message,
                        post: likedPost,
                        createdBy: user,
                        starsCount: likedPost.stars.length,
                        stars: likedPost.stars,
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
    console.log(req.body)
    var user = await User.findById(creator);
    if (req.user.roles.indexOf('User') > -1 || req.user.roles.indexOf('Admin') > -1) {
        Post
            .findById(id)
            .then(async (post) => {
                let postTitle = post.title;
                try {
                    let category = await Category.findOne({ name: post.category });
                    let filtered = category.posts.filter(p => p.toString() !== id.toString());
                    category.posts = filtered
                    await category.save();
                    let filteredPosts = user.posts.filter(p => p.toString() !== id.toString());
                    user.posts = filteredPosts
                    await user.save();
                    //remove from categories and users!!!

                } catch (error) {
                    console.log(error)
                }

                let creatorPossible = req.user._id;
                if (creatorPossible.toString() === post.createdBy.toString() || req.user.roles.includes('Admin')) {
                    Post
                        .findByIdAndDelete(id)
                        .then(() => {
                            return res.status(200).json({
                                success: true,
                                message: `Post "${postTitle}" deleted successfully!`
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