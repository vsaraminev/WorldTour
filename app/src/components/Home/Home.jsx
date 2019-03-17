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
                <div className="space-top text">
                    <h2>Welcome to World Tour !</h2>
                    {!this.state.isAuth &&<p className='lead text-muted'>Taking a Round the World Tour is becoming easier and more convenient than ever before!<br/> Register now and view details.</p>}
                </div>
                <TourList isAuth={this.state.isAuth} tours={this.state.tours} />
            </div>
        )
    }
}
export default Home;