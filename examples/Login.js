
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Form from './components/Form';
import MyInput from './components/Input';

class Login extends Component {
  constructor (props) {
  	super(props);

  	this.state = {canSubmit: false};
  }

  submit(data) {
    alert(JSON.stringify(data, null, 4));
  }

  enableButton() {
    this.setState({ canSubmit: true });
  }

  disableButton() {
    this.setState({ canSubmit: false });
  }

  render() {
    return (
      <Form 
      	onSubmit={this.submit} 
      	onValid={this.enableButton} 
      	onInvalid={this.disableButton} 
      	className="login">
        <MyInput 
        	value="" 
        	name="email" 
        	title="Email" 
        	validations="isEmail" 
        	validationError="This is not a valid email" 
        	required />
        <MyInput 
        	value="" 
        	name="password" 
        	title="Password" 
        	type="password" 
        	required />
        <button type="submit" className="btn btn-primary">Submit</button>
      </Form>
    );
  }
}

export default Login;
