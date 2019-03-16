import React from 'react'
import { Link } from 'react-router-dom'

export default function User({ id, username, firstName, lastName, email }) {
    return (
        <tr key={id}>
            <td>{username}</td>
            <td>{firstName}</td>
            <td>{lastName}</td>
            <td>{email}</td>
            <td><Link to={'/user/details/' + id} className="btn btn-info">Profile Info</Link></td>
        </tr>
        // <tr key={id} className="table-active">
        //     <th scope="row">{username}</th>
        //     <td>{email}</td>
        //     <td>{firstName}</td>
        //     <td>{lastName}</td>
        //     <td><Link to={'/user/edit/' + id} className="btn btn-warning">Edit</Link></td>
        //     <td><Link to={'/user/delete/' + id} className="btn btn-danger">Delete</Link></td>
        // </tr>
    )
}


