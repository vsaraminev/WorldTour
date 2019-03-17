const authRoutes = require('../routes/auth')
const tourRoutes = require('../routes/tour')
const userRoutes = require('../routes/user')
const postRoutes = require('../routes/post')

module.exports = (app) => {
  app.use('/auth', authRoutes)
  app.use('/tour', tourRoutes)
  app.use('/user', userRoutes)
  app.use('/post', postRoutes)
}
