import React from 'react'
import { Link } from 'react-router-dom'

export default function User({ id, username, email, firstName, lastName }) {
    return (
        <tr key={id} className="table-active">
            <th scope="row">{username}</th>
            <td>{email}</td>
            <td>{firstName}</td>
            <td>{lastName}</td>
            <td><Link to={'/user/edit/' + id} className="btn btn-warning">Edit</Link></td>
            <td><Link to={'/user/delete/' + id} className="btn btn-danger">Delete</Link></td>
        </tr>
    )
}


