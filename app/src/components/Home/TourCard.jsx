import React from 'react';
import { Link } from 'react-router-dom';

export default function TourCard({ id, title, country, price, image, isAuth }) {
    return (
        <div className="col-md-4 photo">
            <div className="card text-white bg-primary">
                <div className="card-body">
                    <blockquote className="card-blockquote">
                        <img className="list" src={image} alt={image} />
                        <div className="card-body">
                            <div className="pull-right">
                                <p className="details"><b>Country:</b> {country}</p>
                                {isAuth && <Link to={'/tour/details/' + id} className="btn btn-info">Details</Link>}
                            </div>
                        </div>
                    </blockquote>
                </div>
            </div>
        </div>
    )
}
