import React, { Component } from 'react';
import { Link } from 'react-router';

//import logo from './logo.svg';
//import './App.css';

class App extends React.Component {
  render() {
    return (
      <div>
        <ul>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
        {this.props.children}
      </div>
    )
  }
}

export default App;