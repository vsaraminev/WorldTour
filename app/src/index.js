import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './style/bootstrap.min.css';
import './style/site.css';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

ReactDOM.render(
    <Router>
        <App />
    </Router>
    , document.getElementById('root'));
