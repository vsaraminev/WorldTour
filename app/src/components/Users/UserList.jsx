import React, { Component } from 'react'
import UserCard from './UserCard';

class UserList extends Component {
    render() {
        return (
            <div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Username</th>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Info</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.users.map(u => (
                            <UserCard
                            key={u._id}
                            id={u._id}
                            username={u.username}
                            email={u.email}
                            firstName={u.firstName}
                            lastName={u.lastName}/>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default UserList
