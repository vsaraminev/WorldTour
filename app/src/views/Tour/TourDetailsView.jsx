import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import TourService from '../../services/tour-service';
import PostService from '../../services/post-service';
import TourDetails from '../../components/TourDetails/TourDetails';

class TourDetailsView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tour: {},
            createdBy: {},
            posts: [],
            redirect: false,
            notAllowed: false,
        }

        this.TourService = new TourService();
        this.PostService = new PostService();
        this.updateState = this.updateState.bind(this);
        this.handleClickDelete = this.handleClickDelete.bind(this);
    }

    async componentWillMount() {
        const id = this.props.match.params.id;
        const result = await this.TourService.details(id);

        if (result.tour) {
            this.setState({
                tour: result.tour,
                createdBy: result.createdBy,
                posts: result.posts,
            })
        }        
    }

    async updateState() {
        const id = this.props.match.params.id;
        console.log(this.state)
        let result = await this.PostService.allByTour(id);
        if (result.posts) {
            result.posts.sort((a, b) => {
                return a.createdOn > b.createdOn ? -1 : 1;
            })
            this.setState({
                commentAdded: true,
                posts: result.posts
            })
        }
        console.log(this.state)

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
        let redirectLink = `/user/details/${this.state.createdBy}`;
    
        return (
            <div className="col s10 offset-s1">
                {(!this.state.redirect) ? (
                    <TourDetails {...this.state} {...this.props} handleClickStar={this.handleClickStar} updateState={this.updateState} />
                ) : (<Redirect to={redirectLink} />)}
            </div>
        )
    }
}
export default TourDetailsView;
