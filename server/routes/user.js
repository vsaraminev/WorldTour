const express = require('express');
const authCheck = require('../config/auth-check');
const User = require('../models/User');
const Tour = require('../models/Tour');

const router = new express.Router()

router.get('/details/:id', authCheck, async (req, res) => {
  const id = req.params.id
  User
    .findById(id)
    .populate('tours')
    .then(user => {
      if (!user) {
        const message = 'User not found.'
        return res.status(200).json({
          success: false,
          message: message
        })
      }

      let userTours = user.tours;
      return res.status(200).json({
        success: true,
        message: 'User details info.',
        user: user,
        tours: userTours
      })
    })
    .catch((err) => {
      let message = 'Something went wrong :( Check the form for errors.'
      return res.status(200).json({
        success: false,
        message: message
      })
    })
})

router.get('/all', async (req, res) => {
  User
    .find()
    .then(users => {
      if (!users) {
        const message = 'Users not found.'
        return res.status(200).json({
          success: false,
          message: message
        })
      }
      return res.status(200).json({
        success: true,
        message: 'All users info.',
        users: users,
      })
    })
    .catch((err) => {
      let message = 'Something went wrong :( Check the form for errors.'
      return res.status(200).json({
        success: false,
        message: message
      })
    })
})

router.delete('/delete/:id', authCheck, async (req, res) => {
  try {
    const id = req.params.id
    const userToDelete = await User
      .findById(id)

    const tours = await Tour.find({ createdBy: userToDelete._id })

    const deleted = await Tour.deleteMany({ createdBy: userToDelete._id })

    if (deleted) {
      let deletedUser = await User.findByIdAndDelete(id);
      return res.status(200).json({
        success: true,
        message: 'User was deleted successfully!',
        user: userToDelete,
      })
    } else {
      return res.status(200).json({
        success: false,
        message: 'Error!',
      })
    }


  } catch (err) {
    console.log(err)
    const message = 'Something went wrong :( Check the form for errors.'
    return res.status(200).json({
      success: false,
      message: message
    })
  }
})

module.exports = router
