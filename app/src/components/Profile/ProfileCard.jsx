import React from 'react';

export default function ProfileCard({ username, firstName, lastName, avatar, email }) {
    return (
        <div className="row">
            <div className="row space-top space-left">
                <div className="col-md-3">
                    <div className="card text-white bg-primary">
                        <div className="card-body">
                            <blockquote className="card-blockquote">
                                <img className="details" src={avatar} alt={avatar} />
                            </blockquote>

                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <p className="details"><b>Title:</b> {username}</p>
                    <hr />
                    <p className="details"><b>Country:</b> {firstName}</p>
                    <p className="details"><b>Description:</b> {lastName}</p>
                    <p className="details"><b>Price:</b> {email}</p>
                    <hr />
                </div>
            </div>
        </div>
    )
}
