import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import { toast } from 'react-toastify';
import Input from '../common/Input/Input';
import AuthService from '../../services/auth-service';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {
        username: null,
        password: null
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

  if(this.state.userData.hasOwnProperty(name)) {
    const value = event.target.value;

    let userData = {...this.state.userData};
    userData[name] = value;

    this.setState({userData});
  }
}

async handleSubmit(event) {
  event.preventDefault();
  this.setState({message: ''})

  const result = await this.AuthService.login(this.state.userData);

  if(!result.userId) {
    this.setState({message: 'Invalid credentials!'})
    toast.error(this.state.message);
  } else if(result.error){
    this.setState({message: result.error})
    toast.error(result.error);
  } else {
    toast.success(result.message);
    this.props.loginUser(result)
    this.setState({
      redirect: true,
    });
  }
}

render() {
  const redirectLink = `/`
  let renderLogin = (
    <div className="container">
                <div className="row space-top">
                    <div className="col-md-12">
                        <h1>Log in</h1>
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
                                name='password'
                                type='password'
                                value={this.state.password}
                                onchange={this.handleChange}
                                label='Password'
                            />
                            <input type="submit" className="btn btn-primary" value="Login" />
                        </div>
                    </div>
                </form>
            </div>
  )

  return (
    <div >
      {(!this.state.redirect) ? (renderLogin) : (<Redirect to={redirectLink}/>)}
    </div>
    )
  }
}

export default Login;
