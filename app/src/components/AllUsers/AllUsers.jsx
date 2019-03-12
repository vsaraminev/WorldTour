import React, { Component } from 'react';
import UserService from '../../services/user-service';
import UserList from './UserList';

class AllUsersAdmin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
        }

        this.UserService = new UserService();
        this.handleClick = this.handleClick.bind(this);
    }
    async componentWillMount() {
        const result = await this.UserService.all();

        if (result.users) {
            this.setState({ users: result.users })
        }
    }

    handleClick() {
        localStorage.removeItem('message')
    }

    render() {
        return (
            <div>
                <h1 className='text-center'>All Users</h1>
                <hr className="my-4" />
                <UserList users={this.state.users} />
            </div>
        );
    }
}

export default AllUsersAdmin;
