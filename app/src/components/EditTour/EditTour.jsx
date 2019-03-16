import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import Input from '../common/Input/Input'
import TourService from '../../services/tour-service';

class EditTour extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tour: {
                title: '',
                country: '',
                description: '',
                cost: '',
                image: ''
            },
            redirect: false,
            editedTourId: null,
            message: ''
        }


        this.TourService = new TourService();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        const id = this.props.match.params.id;
        try {
            let { tour } = await this.TourService.details(id);

            this.setState({
                tour: {
                    title: tour.title,
                    country: tour.country,
                    description: tour.description,
                    cost: Number(tour.cost),
                    image: tour.image
                },
                message: ''
            })
        } catch (error) {
            console.log(error)
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        if (!this.isTourValid(this.state.tour)) {
            return;
        }

        let tourData = this.state.tour;
        const id = this.props.match.params.id;
        tourData.createdBy = this.props.userId;
        let body = await this.TourService.edit({id, tourData});
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
                editedTourId: body.data._id
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
            toast.error("Description is required!");
            isValid = false;
        }
        // if (!tour.price || !tour.price.trim()) {
        //     toast.error("Price is required!");
        //     isValid = false;
        // }
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
        const isAuth = localStorage.hasOwnProperty("ujwt")
        const redirectLink = `/tour/details/${this.state.editedTourId}`
        let { title, country, image, description, cost } = this.state.tour;

        let renderIfAuth = (
            <div className="container">
                <div className="row space-top">
                    <div className="col-md-12">
                        <h1>Edit Tour</h1>
                        <p>Please fill all fields.</p>
                    </div>
                </div>
                <form onSubmit={this.handleSubmit}>
                    <div className="row space-top">
                        <div className="col-md-6">
                            <Input
                                name='title'
                                value={title}
                                onchange={this.handleChange}
                                label='Title'
                            />
                            <Input
                                name='country'
                                value={country}
                                onchange={this.handleChange}
                                label='Country'
                            />
                            <Input
                                name='description'
                                value={description}
                                onchange={this.handleChange}
                                label='Description'
                            />
                        </div>
                        <div className="col-md-6">
                            <Input
                                name='image'
                                value={image}
                                onchange={this.handleChange}
                                label='Image Url'
                            />
                            <Input
                                name='cost'
                                type='Number'
                                value={cost}
                                onchange={this.handleChange}
                                label='Cost'
                            />
                        </div>
                    </div>
                    <input type="submit" className="btn btn-primary" value="Edit" />
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

export default EditTour;
