import React, { Component } from 'react';
import TourService from '../../services/tour-service'
import TourList from './TourList';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuth: '',
            tours: [],
            tourId: undefined,
        }

        this.TourService = new TourService();
        this.handleChange = this.handleChange.bind(this);
    }

    async componentWillMount() {
        const isAuth = this.props.isLoggedIn;

        let data = await this.TourService.all();
        if (data.tours) {
            let orderedTours = data.tours.sort((a, b) => {
                return a.createdOn < b.createdOn
            })
            if (this.state.filter !== '')

                localStorage.removeItem('message')

            this.setState({
                message: '',
                tours: orderedTours,
                isAuth: isAuth,
                hasFetched: true
            })
        }
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        return (
            <div className="container">
                <div className="row space-top">
                    <h1>Welcome to World Tour !</h1>
                </div>
                <TourList isAuth={this.state.isAuth} tours={this.state.tours} />
            </div>
        )
    }
}
export default Home;