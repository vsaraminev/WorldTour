import React, { Component } from 'react';
import TourCard from './TourCard';

class TourList extends Component {
    render() {
        return (
            <div className="row space-top">
                {
                    this.props.tours.map(t => (
                        <TourCard
                            key={t._id}
                            id={t._id}
                            image={t.image}
                            title={t.title}
                            country={t.country}
                            price={t.price}
                            isAdmin={this.props.isAdmin}
                        />
                    ))
                }
            </div>
        )
    }
}

export default TourList;