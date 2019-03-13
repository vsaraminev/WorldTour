import React from 'react';
import { Link } from 'react-router-dom';

export default function TourCard({ id, title, country, price, image, isAuth }) {
    return (
        <div className="col-md-3">
            <div className="card text-white bg-primary">
                <div className="card-body">
                    <blockquote className="card-blockquote">
                        <img alt={image} src={image} />
                        <br />
                        <br />
                        <div>{title}</div>
                        <br />
                        <div>Country: {country}</div>
                        <footer>
                            <cite title="Source Title">{price} lv.</cite>
                        </footer>
                        <div className="pull-right">
                            {isAuth && <Link to={'/tour/details/' + id} className="btn btn-info">Details</Link>}
                        </div>
                    </blockquote>
                </div>
            </div>
        </div>
    )
}
