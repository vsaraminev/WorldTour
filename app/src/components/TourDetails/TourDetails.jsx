import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import TourService from '../../services/tour-service';

class TourDetails extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tour: {},
            starsCount: 0,
            createdBy: {},
            stars: [],
            redirect: false,
            notAllowed: false,
            liked: false
        }

        this.TourService = new TourService();
        this.handleClickStar = this.handleClickStar.bind(this);
        this.handleClickDelete = this.handleClickDelete.bind(this);
    }

    async componentWillMount() {
        const id = this.props.match.params.id;
        const result = await this.TourService.details(id);
        if (result.tour) {
            this.setState({
                tour: result.tour,
                starsCount: result.starsCount,
                createdBy: result.createdBy,
                stars: result.stars,
                liked: result.stars
            })
        }

    }

    async handleClickStar(event) {
        event.preventDefault()
        const id = this.props.match.params.id;

        let result = await this.TourService.star(id);
        if (result.tour) {
            toast.success(result.message)
            this.setState({
                tour: result.tour,
                starsCount: result.starsCount,
                createdBy: result.createdBy,
                stars: result.stars,
                liked: result.stars.includes(this.props.userId)
            })
        }
        return;

    }

    async handleClickDelete() {
        const id = this.state.tour._id;
        const creatorId = this.state.tour.createdBy;

        const body = await this.TourService.remove({ id, creatorId });

        if (this.props.isAdmin === true) {
            if (body.error) {
                this.setState({ message: body.error })
                toast.error(body.error);
            } else {
                toast.success(body.message);

                localStorage.setItem('message', body.message)
                this.setState({
                    redirect: true,
                });
            }
        } else {
            localStorage.setItem('message', 'You are not allowed for this operation!')
            this.setState({
                redirect: true,
            });
        }
    }

    render() {
        //let redirectLink = `/user/details/${this.state.createdBy._id}`;
        let toRender = null;
        let isAdmin = localStorage.getItem('isAdmin') === "true"
        let isCreator = this.state.createdBy === this.props.userId;

        if (!this.state.redirect) {
            let { title, country, description, price, image, _id } = this.state.tour;

            toRender = (
                <div className="container">
                    <div className="row space-top">
                        <div className="col-md-12">
                            <h1>Tour Details</h1>
                        </div>
                    </div>
                    <div className="row space-top">
                        <div className="col-md-4">
                            <div className="card text-white bg-primary">
                                <div className="card-body">
                                    <blockquote className="card-blockquote">
                                        <img alt={image} src={image} />
                                    </blockquote>
                                </div>
                            </div>
                            <div className="pull-right">
                                {(isCreator || isAdmin) && <Link to={'/tour/edit/' + _id} className="btn btn-warning">Edit</Link>}
                                {isAdmin && <button type="button" onClick={this.handleClickDelete} className="btn btn-danger" >Delete</button>}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <p>Title: {title}</p>
                            <p>Country: {country}</p>
                            <p>Description: {description}</p>
                            <p>Price: {price}</p>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="col s10 offset-s1">
                {(!this.state.redirect) ? (toRender) : (<Redirect to='/' />)}
            </div>
        )
    }
}
export default TourDetails;
