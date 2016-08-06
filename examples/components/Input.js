import React, { Component } from 'react';
import classNames from 'classnames'
import { RFInputHOC as RFInput } from 'rforms';

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
