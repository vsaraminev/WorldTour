import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import Input from '../common/Input/Input'
import TourService from '../../services/tour-service';

class Create extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tour: {
        title: '',
        country: '',
        description: '',
        trailer: '',
        cost: '',
        image: ''
      },
      redirect: false,
      createdTourId: null,
      message: ''
    }


    this.TourService = new TourService();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();
    if (!this.isTourValid(this.state.tour)) {
      return;
    }

    let tourData = this.state.tour;
    tourData.createdBy = this.props.userId;

    let body = await this.TourService.create(tourData);
    if (body.errors) {
      this.setState({ message: '' })
      let err = this.state.message;
      let values = Object.values(body.errors)
      values.forEach(error => {
        err = err + ' ' + error;
      })
      this.setState({ message: err })
      toast.error(err);
      return;
    } else if (body.error) {
      this.setState({ message: body.error })
      toast.error(body.error);
    } else {
      toast.success(body.message);
      this.setState({
        redirect: true,
        createdTourId: body.data._id
      });
    }
  }

  isTourValid(tour) {
    let isValid = true;

    if (!tour.title || !tour.title.trim() || tour.title.length < 3 || tour.title.length > 50) {
      toast.error("Title is required and must be at least 3 symbols and less than 50 symbols.");
      isValid = false;
    }
    if (!tour.country || !tour.country.trim() || tour.country.length < 3 || tour.country.length > 50) {
      toast.error("Country is required and must be at least 3 symbols and less than 50 symbols.");
      isValid = false;
    }
    if (!tour.description || !tour.description.trim() || tour.description.length < 3 || tour.description.length > 5000) {
      toast.error("Description is required and must be at least 5 symbols and less than 120 symbols.");
      isValid = false;
    }
    if (!tour.cost || !tour.cost.trim()) {
      toast.error("Cost is required!");
      isValid = false;
    }
    if (!tour.image || !tour.image.trim()) {
      toast.error("Image Url is required!");
      isValid = false;
    }

    return isValid;
  }


  handleChange(event) {
    const name = event.target.name;

    if (this.state.tour.hasOwnProperty(name)) {
      const value = event.target.value;

      let tour = { ...this.state.tour };
      tour[name] = value;

      this.setState({ tour });
    }
  }

  render() {
    const isAuth = localStorage.ujwt !== null
    const redirectLink = `/tour/details/${this.state.createdTourId}`

    let renderIfAuth = (
      <div className="container">
        <div className="row space-top">
          <div className="col-md-12">
            <h1>Create New Tour</h1>
            <p>Please fill all fields.</p>
          </div>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="row space-top">
            <div className="col-md-6">
              <Input
                name='title'
                value={this.state.title}
                onchange={this.handleChange}
                label='Title'
              />
              <Input
                name='country'
                value={this.state.country}
                onchange={this.handleChange}
                label='Country'
              />
              <Input
                name='description'
                value={this.state.description}
                onchange={this.handleChange}
                label='Description'
              />
            </div>
            <div className="col-md-6">
              <Input
                name='image'
                value={this.state.image}
                onchange={this.handleChange}
                label='Image Url'
              />
              <Input
                name='cost'
                type='Number'
                value={this.state.cost}
                onchange={this.handleChange}
                label='Cost'
              />
            </div>
          </div>
          <input type="submit" className="btn btn-primary" value="Create" />
        </form>
      </div>
    );

    return (
      <div className="Create">
        {(isAuth && !this.state.redirect) ? (renderIfAuth) : (<Redirect to={redirectLink} />)}
      </div>
    );
  }
}

export default Create;
