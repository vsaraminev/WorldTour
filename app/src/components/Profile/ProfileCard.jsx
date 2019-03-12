import React from 'react';

export default function ProfileCard({ username, firstName, lastName, avatar, email }) {
    return (
        <div className="col-md-3">
            <div className="card text-white bg-primary">
                <div className="card-body">
                    <blockquote className="card-blockquote">
                        <img alt={avatar} src={avatar} />
                        <br />
                        <br />
                        <div>Username: {username}</div>
                        <br />
                        <div>First Name: {firstName}</div>
                        <br />
                        <div>Last Name: {lastName}</div>
                        <br />
                        <div>Email: {email}</div>
                        {/* <footer>
                            <cite title="Source Title">{price} lv.</cite>
                        </footer> */}
                    </blockquote>
                </div>
            </div>
        </div>
    )
}
