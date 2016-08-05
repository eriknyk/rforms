R-Forms
=======

A form input builder and validator for React JS ***(Inspired/Based on formsy-react)***

## Why I make this Port
I loved formsy-react because it gave the flexibility that I needed, however some internal behaiours of the form component was not help as I would wanted to have it.
After tried to apport reporting issue on the repository, after to see the code I saw that those behaviors would be very difficult to change, because It was conceived from the beginning as well, I'm talking about behaviours that personally I don't like:

**I love:**
- built-in validations
- add custom validations
- can compose the form inputs to my needs.

**I don't like:**
- validation of the all form inputs after first render
- validation of the all form inputs when a single input has changed

I've started this project because actually formsy-react seems not maintained and because I've changed the behavoiurs that I don't like, I took some parts of formsy-react, and other parts are completelly new


## <a name="background">Background (From Formsy-react)</a>
formsy-react author says:

I wrote an article on forms and validation with React JS, [Nailing that validation with React JS](http://christianalfoni.github.io/javascript/2014/10/22/nailing-that-validation-with-reactjs.html), the result of that was this extension.

The main concept is that forms, inputs and validation is done very differently across developers and projects. This extension to React JS aims to be that "sweet spot" between flexibility and reusability.

## What you can do

  1. Build any kind of form element components. Not just traditional inputs, but anything you want and get that validation for free

  2. Add validation rules and use them with simple syntax

  3. Use handlers for different states of your form. Ex. "onSubmit", "onError", "onValid" etc.

  4. Pass external errors to the form to invalidate elements

  5. You can dynamically add form elements to your form and they will register/unregister to the form



## Install

  `npm install rforms`

## How to use

See [`examples` folder](/examples) for examples. [demo](http://rforms-demo.herokuapp.com/login).

Complete API reference is available [here](/API.md).

#### RForms gives you a form straight out of the box

```jsx
import React, { Component } from 'react';

import Form from 'rforms';
import MyInput from './components/Input';

class Login extends Component {
  submit(data) {
    alert(JSON.stringify(data, null, 4));
  }

  render() {
    return (
      <Form onSubmit={this.submit}>
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
```

This code results in a form with a submit button that will run the `submit` method when the submit button is clicked with a valid email. The submit button is disabled as long as the input is empty ([required](/API.md#required)) or the value is not an email ([isEmail](/API.md#validators)). On validation error it will show the message: "This is not a valid email".

#### Building a form element (required)
```jsx
import React, { Component } from 'react';
import classNames from 'classnames'
import { RFInput } from 'rforms';

class MyInput extends Component {
  constructor (props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  // Set specific classNames based on the validation
  // state of this component. showRequired() is true
  // when the value is empty and the required prop is
  // passed to the input. showError() is true when the
  // value typed is invalid

  get classNameGroup () {
    return classNames({
      'form-group': true,
      'has-warning': this.props.showError(),
      'has-danger': this.props.showRequired()
    })
  };

  get className () {
    return classNames({
      'form-control': true,
      'form-control-warning': this.props.showError(),
      'form-control-danger': this.props.showRequired()
    })
  };

  // setValue() will set the value of the component
  handleChange (event) {
    this.props.setValue(event.currentTarget[this.props.type === 'checkbox' ? 'checked' : 'value']);
  }

  render() {
    // An error message is returned ONLY if the component is invalid
    // or the server has returned an error message
    const errorMessage = this.props.getErrorMessage() || (this.props.showRequired() && 'This field is required!');

    return (
      <div className={this.classNameGroup}>
        <label htmlFor={this.props.name}>{this.props.title}</label>
        <input
          className={this.className}
          type={this.props.type || 'text'}
          name={this.props.name}
          onChange={this.handleChange}
          onBlur={this.props.validate}
          value={this.props.getValue()}
          checked={this.props.type === 'checkbox' && this.props.getValue() ? 'checked' : null}
        />
        <div className='form-control-feedback'>{errorMessage}</div>
      </div>
    );
  }
}

export default RFInput(MyInput);

```
The form element component is what gives the form validation functionality to whatever you want to put inside this wrapper. You do not have to use traditional inputs, it can be anything you want and the value of the form element can also be anything you want. As you can see it is very flexible, you just have a small API to help you identify the state of the component and set its value.

## Related projects
- Send PR for adding your project to this list!

## Contribute
- Fork repo
- `cd examples`
- `npm install`
- `npm start` runs the development server on `localhost:3000`

##Thanks

Christian Alfoni - [formsy-react](https://github.com/christianalfoni/formsy-react) - which this project is based.


## License

[MIT](/LICENSE)

