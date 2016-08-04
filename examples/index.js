import 'babel-polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';

import App from './App';
import About from './About';
import Login from './Login';

//import './index.css';


ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="about" component={About}/>
      <Route path="login" component={Login}/>
    </Route>
  </Router>,
  document.getElementById('root')
);
