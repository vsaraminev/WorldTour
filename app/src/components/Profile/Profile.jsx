import React, { Component } from 'react';
import TourCard from '../Home/TourCard';
//import { NavLink, Link, Switch } from 'react-router-dom';
import UserService from '../../services/user-service';
import ProfileCard from './ProfileCard';

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      tours: {}
    }
    this.UserService = new UserService();
    this.handleClick = this.handleClick.bind(this);
  }
  async componentWillMount() {
    const id = this.props.match.params.id;

    const result = await this.UserService.userDetails(id);
    //console.log(result);

    if (result.user) {
      this.setState({
        user: result.user,
        tours: result.tours
      })
    }
    console.log(this.state.tours);
  }

  handleClick(event) {
    event.preventDefault()
  }

  render() {
    const toursValues = Object.values(this.state.tours);
    toursValues.map(v => {
      v.createdBy = {};
      v.createdBy['username'] = this.state.user.username;
      return v;
    })
    const { username, email, firstName, lastName, avatar } = this.state.user;

    return (
      <div className="container">
        <div className="row space-top">
            <ProfileCard
              username={username}
              firstName={firstName}
              lastName={lastName}
              email={email}
              avatar={avatar}
            />
            {toursValues.length > 0 ? (toursValues.map((t, i) => (
              <TourCard
                key={t._id}
                id={t._id}
                image={t.image}
                title={t.title}
                country={t.country}
                price={t.price}
                isAdmin={this.props.isAdmin}
              />))
            ) : (<h4>No tours added!</h4>)}
        </div>
      </div>
    );
  }
}

export default Profile;
