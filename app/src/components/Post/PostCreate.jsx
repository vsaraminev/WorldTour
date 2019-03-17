import React, { Component } from 'react';
import { toast } from 'react-toastify';
import PostService from '../../services/post-service';
import isValidPost from '../../util/PostValidation';

class PostCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post: {
                content: '',
                tourId: '',
                createdBy: '',
            },
            redirect: false,
            createdCommentId: null,
            errors: {},
            message: ''
        }

        this.PostService = new PostService();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        this.setState({
            post: {
                content: '',
                tourId: '',
                createdBy: '',
            },
            redirect: false,
            createdCommentId: null,
            errors: {},
            message: ''
        })
    }

    async handleSubmit(event) {
        event.preventDefault();
        event.target.children[0].children[1].value = '';
        const validatePost = isValidPost(this.state);
        const validateErrors = validatePost.errors;
        const isValid = validatePost.isValid;

        if (!isValid) {
            this.setState({ errors: validateErrors })
            return;
        }

        let data = this.state.post;
        data.createdBy = this.props.user;
        data.tourId = this.props.match.params.id;

        const body = await this.PostService.create(data);

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
            this.props.updateState()

            this.setState({
                redirect: true,
                createdPostId: body.data._id,
                post: {
                    content: '',
                    tourId: '',
                    createdBy: '',
                },
                errors: {},
                message: ''
            });
        }
    }

    handleChange(event) {
        const name = event.target.name;

        if (this.state.post.hasOwnProperty(name)) {
            const value = event.target.value;

            let post = { ...this.state.post };
            post[name] = value;
            this.setState({ post });
        }
    }

    render() {
        return (
            <div className="col-md-12 ">
                <form onSubmit={this.handleSubmit}>
                    <div className="input-field col s12">
                    <legend>Leave comment</legend>
                        <textarea style={{ minHeight: 80 + "px" }} className="input-field col s12 white" type="text" onChange={this.handleChange} name="content" id="content"></textarea>
                        <span className="input-field col s12">
                            <input type="submit" className='btn btn-primary' value="ADD COMMENT" />
                        </span>
                    </div>
                </form>
            </div>
            // <div className="col-md-12">
            //     <form onSubmit={this.handleSubmit}>
            //         <legend>Leave comment</legend>
            //         <div className="form-group">
            //             <textarea style={{ minHeight: 80 + "px" }} className="input-field col s12 white" type="text" onChange={this.handleChange} name="content" id="content"></textarea>
            //             <div className='red-text'>{this.state.errors.content}</div>
            //         </div>
            //         <span className="input-field col s12">
            //         <input type="submit" className="btn btn-primary" value="Submit comment" />
            //         </span>
            //     </form>
            // </div>
        );
    }
}

export default PostCreate;
