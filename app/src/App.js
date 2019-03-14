import React, { Component, Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PostService from './services/post-service'

import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer'
import Home from './components/Home/Home';
import EditTour from './components/EditTour/EditTour'
import Profile from './components/Profile/Profile';
import AllUsers from './components/AllUsers/AllUsers';
const Create = lazy(() => import('./components/Create/Create'));
const TourDetails = lazy(() => import('./components/TourDetails/TourDetails'));
const Auth = lazy(() => import('./Auth'));

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAdmin: localStorage.getItem('isAdmin') === 'true' || false,
      isLoggedIn: false,
      jwtoken: localStorage.getItem('username') || null,
      user: localStorage.getItem('username') || null,
      userId: localStorage.getItem('userId') || null,
      message: ''
    }

    this.PostService = new PostService();
    this.loginUser = this.loginUser.bind(this);
    this.logout = this.logout.bind(this);
  }

  async componentWillMount() {

    localStorage.removeItem('message')
    if (localStorage.getItem('userId')) {
      this.setState({
        user: localStorage.getItem('username'),
        userId: localStorage.getItem('userId'),
        jwtoken: localStorage.getItem('ujwt'),
        isLoggedIn: true,
        isAdmin: localStorage.getItem('isAdmin') === 'true',
        message: '',

      })
    } else {
      this.setState({ message: '' })
    }
  }

  loginUser(user) {
    if (user && user.userId) {
      this.setState((prevState, props) => ({
        user: user.username,
        userId: user.userId,
        isLoggedIn: true,
        isAdmin: user.isAdmin,
        message: user.message,
        jwtoken: user.token
      }));
      localStorage.setItem('isAdmin', user.isAdmin);
      localStorage.setItem('username', user.username);
      localStorage.setItem('userId', user.userId);
      localStorage.setItem('ujwt', user.token);
    }
  }

  logout(event) {
    event.preventDefault();
    this.setState({
      isAdmin: false,
      isLoggedIn: false,
      user: null,
      userId: null,
      isFetched: false,
      message: 'Logged Out!'
    })
    localStorage.clear()
    toast.success('Logged Out!');
  }

  render() {
    return (
      <div className="App">
        <Suspense fallback={<h1 className='teal'>Loading...</h1>}>
          <Header {...this.state} logout={this.logout} />
          <main>
            <Switch>
              <Route exact path='/' render={(props) => <Home
                {...props}
                {...this.state} />} />
              <Route exact path='/tour/create'
                render={(props) =>
                  (!localStorage.hasOwnProperty('ujwt')) ? (<Redirect to="/" />
                  ) : (<Create {...props} {...this.state} />)}
              />
              <Route path='/tour/details/:id'
                render={(props) =>
                  (!localStorage.hasOwnProperty('ujwt')
                  ) ? (<Redirect to="/" />
                    ) : <TourDetails {...props} {...this.state} />} />
              <Route exact path='/tour/edit/:id'
                render={(props) =>
                  (!localStorage.hasOwnProperty('ujwt')
                  ) ? (<Redirect to="/" />
                    ) : (<EditTour {...props} {...this.state} />)}
              />
              <Route path='/user/details/:id' render={(props) =>
                (!localStorage.hasOwnProperty('ujwt')) ? (<Redirect to="/" />
                ) : (<Profile {...props} {...this.state} />)}
              />
              <Route path='/auth'
                render={(props) => <Auth
                  {...props}
                  {...this.state}
                  loginUser={this.loginUser} />}
              />
              <Route exact path='/user/all'
                render={(props) =>
                  ((!localStorage.hasOwnProperty('isAdmin') || this.state.isAdmin === false)
                  ) ? (<Redirect to="/" />
                    ) : (<AllUsers {...props} {...this.state} />)}
              />
            </Switch>
            <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              rtl={false}
              pauseOnVisibilityChange
              draggable
              pauseOnHover />
            <Footer  {...this.state} logout={this.logout} />
          </main>
        </Suspense>
      </div>
    );
  }
}

export default App;
