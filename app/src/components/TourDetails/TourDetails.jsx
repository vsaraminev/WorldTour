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
        let toRender = null;
        let isAdmin = localStorage.getItem('isAdmin') === "true"
        let isCreator = this.state.createdBy === this.props.userId;

        if (!this.state.redirect) {
            let { title, country, description, price, image, _id } = this.state.tour;

            toRender = (
                <div>
                    <div className="row space-top">
                        <div className="col-md-6">
                            <div className="card text-white bg-primary">
                                <div className="card-body">
                                    <blockquote className="card-blockquote">
                                        <img className="details" src={image} alt={image} />
                                    </blockquote>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <p className="details"><b>Title:</b> {title}</p>
                            <hr />
                            <p className="details"><b>Country:</b> {country}</p>
                            <p className="details"><b>Description:</b> {description}</p>
                            <p className="details"><b>Price:</b> {price}</p>
                            <hr />
                            <div className="btns">
                                {(isCreator || isAdmin) && <Link to={'/tour/edit/' + _id} ><button type="button" className="btn btn-warning left">Edit photo</button></Link>}
                                {isAdmin && <a><button type="button" onClick={this.handleClickDelete} className="btn btn-danger right">Delete photo</button></a>}
                            </div>
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
