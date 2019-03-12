import React, { Component } from 'react';
import {Link, NavLink } from 'react-router-dom';

class Header extends Component {
  render() {
    let isAuth = (this.props.userId)
    let isAdmin = (this.props.isAdmin)
    let userDetails = `/user/details/${this.props.userId}`
    return (
      <header>
        <nav>
          <div className="navbar navbar-dark bg-primary">
            <div className="container">
              <div className="row" >
                <div className="col-md-12" >
                  <Link className="navbar-brand" to="/">World Tour</Link>
                  <NavLink className="nav-link" activeClassName="active" exact to="/">Home</NavLink>
                  {isAuth && <NavLink className="nav-link" activeClassName="active" to="/tour/create">Create</NavLink>}
                  {isAdmin && <NavLink className="nav-link" activeClassName="active" to="/user/all">Users</NavLink>}
                  {isAuth && <NavLink className="nav-link" activeClassName="active" to={userDetails}>Profile</NavLink>}
                  {isAuth && <Link className="nav-link" to="/" onClick={this.props.logout}>Logout</Link>}
                  {isAuth && <Link to='#' className="nav-link">Welcome, {this.props.user}!</Link>}
                  {!isAuth && <NavLink className="nav-link" activeClassName="active" to="/auth/login">Login</NavLink>}
                  {!isAuth && <NavLink className="nav-link" activeClassName="active" to="/auth/register">Register</NavLink>}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    )
  }
}

export default Header;