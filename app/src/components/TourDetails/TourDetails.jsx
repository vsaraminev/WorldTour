import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PostCreate from '../Post/PostCreate';
import PostCard from '../Post/PostCard';

class TourDetails extends Component {
    render() {
        const isAdmin = localStorage.getItem('isAdmin') === "true"
        const isCreator = localStorage.getItem('username') === this.props.user;
        const { title, country, description, cost, image, _id } = this.props.tour;
        return (
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
                        <PostCreate {...this.props} handleCreateComment={this.props.handleCreateComment} handleChange={this.props.handleChange} updateState={this.props.updateState} />
                        {(this.props.posts.length > 0)
                            ? (
                                <Fragment>
                                    <br />
                                    <div className="col-md-12">
                                        {this.props.posts.map((comment, i) => (
                                            <PostCard key={comment._id} comment={comment} user={this.props.user} updateState={this.props.updateState} />))}
                                    </div>
                                </Fragment>)
                            : null}
                    </div>
                    <div className="col-md-6">
                        <p className="details"><b>Title:</b> {title}</p>
                        <hr />
                        <p className="details"><b>Country:</b> {country}</p>
                        <p className="details"><b>Description:</b> {description}</p>
                        <p className="details"><b>Cost:</b> ${cost}</p>
                        <hr />
                        <div className="btns">
                            {(isCreator || isAdmin) && <Link to={'/tour/edit/' + _id} ><button type="button" className="btn btn-warning left">Edit tour</button></Link>}
                            {isAdmin && <a><button type="button" onClick={this.handleClickDelete} className="btn btn-danger right">Delete tour</button></a>}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default TourDetails;
