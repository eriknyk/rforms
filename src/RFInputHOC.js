import React, { Component, PropTypes } from 'react';

export default function Decorator (ComposedComponent) {
  class RFInputHOC extends Component {
    constructor (props) {
      super(props);

      this.state = {
        _value: this.props.value,
        _isRequired: false,
        _isValid: true,
        _isPristine: true,
        _pristineValue: this.props.value,
        _validationError: [],
        _externalError: null,
        _formSubmitted: false
      }

      this.getErrorMessage = this.getErrorMessage.bind(this);
      this.getErrorMessages = this.getErrorMessages.bind(this);
      this.setValue = this.setValue.bind(this);
      this.getValue = this.getValue.bind(this);
      this.showRequired = this.showRequired.bind(this);
      this.showError = this.showError.bind(this);
      this.validate = this.validate.bind(this);
      this.isValid = this.isValid.bind(this);
      this.isPristine = this.isPristine.bind(this);
    }

    componentWillMount() {
      this.setValidations(this.props.validations, this.props.required);

      this.context.form.attachInput(this);

      if (!this.props.name) {
        throw new Error('Form Input requires a name property when used');
      }
    }

    componentWillReceiveProps () {
      //this.setValidations(this.props.validations, this.props.required);
    }

    componentWillUnmount() {
      this.context.form.detachInput(this);
    }

    ///////

    setValidations (validations, required) {
      // Add validations to the store itself as the props object can not be modified
      this._validations = convertValidationsToObject(validations) || {};
      this._requiredValidations = required === true ? {isDefaultRequiredValue: true} : convertValidationsToObject(required);

      console.log('>>this._validations', this._validations)
    }

    getErrorMessage () {
      var messages = this.getErrorMessages();

      return messages.length ? messages[0] : null;
    }

    getErrorMessages () {
      return !this.isValid() || this.showRequired() ? (this.state._externalError || this.state._validationError || []) : [];
    }

    getValue () {
      return this.state._value
    }

    setValue (value) {
      this.setState({
        _value: value,
        _isPristine: false
      }, function () {
        //this.context.form.validate(this)
      }.bind(this));
    }

    showRequired () {
      return this.state._isRequired;
    }

    showError () {
      return !this.showRequired() && !this.isValid();
    }

    isValid () {
      return this.state._isValid;
    }

    isPristine () {
      return this.state._isPristine;
    }

    validate () {
      this.context.form.validate(this)
    }

    render() {
      console.log('==> Component state: ', this.state)

      return (
        <ComposedComponent
          {...this.props}
          getErrorMessage={this.getErrorMessage}
          getErrorMessages={this.getErrorMessages}
          setValue={this.setValue}
          getValue={this.getValue}
          showError={this.showError}
          showRequired={this.showRequired}
          validate={this.validate}
          isValid={this.isValid}
          isPristine={this.isPristine}
        />
      );
    }
  }

  RFInputHOC.propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    validations: PropTypes.any,
    required: PropTypes.bool
  }

  RFInputHOC.contextTypes = {
    form: PropTypes.object
  }

  RFInputHOC.defaultProps = {
    validationError: '',
    validationErrors: {}
  }

  return RFInputHOC;
}

/////

var convertValidationsToObject = function (validations) {

  if (typeof validations === 'string') {

    return validations.split(/\,(?![^{\[]*[}\]])/g).reduce(function (validations, validation) {
      var args = validation.split(':');
      var validateMethod = args.shift();

      args = args.map(function (arg) {
        try {
          return JSON.parse(arg);
        } catch (e) {
          return arg; // It is a string if it can not parse it
        }
      });

      if (args.length > 1) {
        throw new Error('Formsy does not support multiple args on string validations. Use object format of validations instead.');
      }

      validations[validateMethod] = args.length ? args[0] : true;
      return validations;
    }, {});

  }

  return validations || {};
};
