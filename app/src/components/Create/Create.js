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
        price: '',
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

    if (!tour.title || !tour.title.trim()) {
      toast.error("Title is required!");
      isValid = false;
    }
    if (!tour.country || !tour.country.trim()) {
      toast.error("Country is required!");
      isValid = false;
    }
    if (!tour.description || !tour.description.trim()) {
      toast.error("Description Url is required!");
      isValid = false;
    }
    if (!tour.price || !tour.price.trim()) {
      toast.error("Price is required!");
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
                name='price'
                type='Number'
                value={this.state.price}
                onchange={this.handleChange}
                label='Price'
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
