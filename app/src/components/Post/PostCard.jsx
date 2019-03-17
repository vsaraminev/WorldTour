import React, { Component } from 'react';
import PostService from '../../services/post-service'

class PostCard extends Component {
    constructor(props) {
        super(props)

        this.PostService = new PostService();
    }

    render() {
        const { _id, content, tourId, createdBy, createdOn } = this.props.comment;
        const isValid = _id && content && tourId && createdBy && createdOn;
        let dateStr;
        if (isValid) {
            dateStr = new Date(createdOn).toLocaleString('en-GB', { timeZone: 'UTC' });
        }
        return (
            <div className="col-md-12">
                <div className="card text-black bg-light">
                    <div className="card-body">
                        <blockquote className="card-blockquote text">
                            <p> " {content} "</p>
                            <p>on {dateStr} by {createdBy}</p>
                        </blockquote>
                    </div>
                </div>
            </div>
        )
    }
}
export default PostCard;
