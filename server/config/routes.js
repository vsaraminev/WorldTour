const authRoutes = require('../routes/auth')
const tourRoutes = require('../routes/tour')
const userRoutes = require('../routes/user')

module.exports = (app) => {
  app.use('/auth', authRoutes)
  app.use('/tour', tourRoutes)
  app.use('/user', userRoutes)
}
