import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import Input from '../common/Input/Input';
import AuthService from '../../services/auth-service';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {
        username: null,
        password: null,
        email: null,
        firstName: null,
        lastName: null,
        avatar: null
      },
      redirect: false,
      message: null
    }

    this.AuthService = new AuthService();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;

    if (this.state.userData.hasOwnProperty(name)) {
      const value = event.target.value;

      let userData = { ...this.state.userData };
      userData[name] = value;

      this.setState({ userData });
    }
  }

  async handleSubmit(event) {
    event.preventDefault();

    const body = await this.AuthService.register(this.state.userData);

    if (body.errors) {
      this.setState({ message: '' })
      let err = this.state.message;
      let values = Object.values(body.errors)
      values.forEach(error => {
        err = err + ' ' + error;
      })
      this.setState({ message: err })
      toast.error(err);
    } else if (body.error) {
      this.setState({ message: body.error })
      toast.error(body.error);
    } else {
      toast.success(body.message);
      await this.props.loginUser(body)
      this.setState({ redirect: true });
    }
  }

  render() {
    const redirectLink = `/`
    let renderRegister = (
      <div className="container">
        <div className="row space-top">
          <div className="col-md-12">
            <h1>Register</h1>
          </div>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="row space-top">
            <div className="col-md-4">
              <Input
                name='username'
                value={this.state.username}
                onchange={this.handleChange}
                label='Username'
              />
              <Input
                name='firstName'
                value={this.state.firstName}
                onchange={this.handleChange}
                placeholder="Your first name here..."
                label='First Name'
              />
              <Input
                name='lastName'
                value={this.state.lastName}
                onchange={this.handleChange}
                placeholder="Your last name here..."
                label='Last Name'
              />
              <Input
                name='email'
                value={this.state.email}
                onchange={this.handleChange}
                placeholder="Your email here..."
                label='Email'
              />
              <Input
                name='password'
                type='password'
                value={this.state.password}
                onchange={this.handleChange}
                label='Password'
              />
              <Input
                name='avatar'
                type='password'
                value={this.state.avatar}
                onchange={this.handleChange}
                placeholder="Your Avatar here..."
                label='Avatar'
              />
              <input type="submit" className="btn btn-primary" value="Register" />
            </div>
          </div>
        </form>
      </div>
    )
    return (
      <div className="Create">
        {(!this.state.redirect) ? (renderRegister) : (<Redirect to={redirectLink} />)}
      </div>
    )
  }
}

export default Register;
