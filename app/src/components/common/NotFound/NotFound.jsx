import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <div className="not-found">
    <div className="jumbotron">
      <h1 className="display-3">Oops!</h1>
      <h2 className="lead">404 Page Not Found :(</h2>
      <hr className="my-4" />
      <p className="lead">
      <Link to="/"><button type="button" className="btn btn-info">&lt;&lt;Return to the home page</button></Link>
      </p>
    </div>
  </div>
)

export default NotFoundPage