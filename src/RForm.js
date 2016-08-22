/**
 * react forms "rforms"
 */

import React, { Component, PropTypes } from 'react';
import validationRules from './validationRules'
import formDataToObject from 'form-data-to-object';

const emptyArray = [];

class RForm extends Component {
  constructor (props) {
    super(props);

    this.inputs = [];
    this.attachInput = this.attachInput.bind(this);
    this.detachInput = this.detachInput.bind(this);
    this.validate = this.validate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      isPristine: true,
      isDirty: false
    }
  }

  getChildContext () {
    return {
      form: {
        attachInput: this.attachInput,
        detachInput: this.detachInput,
        validate: this.validate //,
        // isFormDisabled: this.isFormDisabled,
        // isValidValue: (component, value) => {
        //   return this.runValidation(component, value).isValid;
        // }
      }
    }
  }

  attachInput (component) {
    if (this.inputs.indexOf(component) === -1) {
      this.inputs.push(component);
    }
  }

  detachInput (component) {
    var componentPos = this.inputs.indexOf(component);

    if (componentPos !== -1) {
      this.inputs = this.inputs.slice(0, componentPos).concat(this.inputs.slice(componentPos + 1));
    }
  }

  validate(component, callback) {
    //this.props.onChange(this.getCurrentValues(), this.isChanged());

    const validation = this.runValidation(component);

    component.setState({
      _isValid: validation.isValid,
      _isRequired: validation.isRequired,
      _validationError: validation.error
    }, callback);
  }

  validateForm () {
    // We need a callback as we are validating all inputs again. This will
    // run when the last component has set its state
    var onValidationComplete = function () {
      const isValid = this.inputs.every(component => component.state._isValid);

      this.setState({
        isValid: isValid
      });

      // if (this.state.isValid) {
      //   this.props.onValid();
      // } else {
      //   this.props.onInvalid();
      // }

      // Tell the form that it can start to trigger change events
      // this.setState({
      //   canChange: true
      // });

      if (isValid) {
        this.props.onSubmit(this.getModel());
      }

    }.bind(this);

    // Run validation again in case affected by other inputs. The
    // last component validated will run the onValidationComplete callback
    this.inputs.forEach(function (component, index) {
      // var validation = this.runValidation(component);

      // component.setState({
      //   _isValid: validation.isValid,
      //   _isRequired: validation.isRequired,
      //   _validationError: validation.error,
      // }, index === this.inputs.length - 1 ? onValidationComplete : null);

      this.validate(component, index === this.inputs.length - 1 ? onValidationComplete : null)
    }.bind(this));

    // If there are no inputs, set state where form is ready to trigger
    // change event. New inputs might be added later
    // if (!this.inputs.length && this.isMounted()) {
    //   this.setState({
    //     canChange: true
    //   });
    // }
  }

  getCurrentValues () {
    var data = {};

    Object.keys(this.inputs).forEach(k => {
      data[this.inputs[k].props.name] = this.inputs[k].state._value;
    });

    return data;
  }

  isChanged () {
    return false;
  }

  runValidation (component, value = null) {
    var currentValues = this.getCurrentValues();
    var validationErrors = component.props.validationErrors;
    var validationError = component.props.validationError;

    value = value !== null ? value : component.state._value;

    var validationResults = this.runRules(value, currentValues, component._validations);
    var requiredResults = this.runRules(value, currentValues, component._requiredValidations);

    // the component defines an explicit validate function
    if (typeof component.validate === 'function') {
     /// validationResults.failed = component.validate() ? [] : ['failed'];
    }

    var isRequired = Object.keys(component._requiredValidations).length ? !!requiredResults.success.length : false;
    var isValid = !validationResults.failed.length && !(this.props.validationErrors && this.props.validationErrors[component.props.name]);

    return {
      isRequired: isRequired,
      isValid: isRequired ? false : isValid,
      error: (function () {

        if (isValid && !isRequired) {
          return emptyArray;
        }

        if (validationResults.errors.length) {
          return validationResults.errors;
        }

        if (this.props.validationErrors && this.props.validationErrors[component.props.name]) {
          return typeof this.props.validationErrors[component.props.name] === 'string' ? [this.props.validationErrors[component.props.name]] : this.props.validationErrors[component.props.name];
        }

        if (isRequired) {
          var error = validationErrors[requiredResults.success[0]];
          return error ? [error] : null;
        }

        if (validationResults.failed.length) {
          return validationResults.failed.map(function(failed) {
            return validationErrors[failed] ? validationErrors[failed] : validationError;
          }).filter(function(x, pos, arr) {
            // Remove duplicates
            return arr.indexOf(x) === pos;
          });
        }

      }.call(this))
    };
  }

  runRules (value, currentValues, validations) {
    let results = {
      errors: [],
      failed: [],
      success: []
    };

    if (Object.keys(validations).length) {
      Object.keys(validations).forEach(function (validationMethod) {
        
        if (validationRules[validationMethod] && typeof validations[validationMethod] === 'function') {
          throw new Error('Formsy does not allow you to override default validations: ' + validationMethod);
        }

        if (!validationRules[validationMethod] && typeof validations[validationMethod] !== 'function') {
          throw new Error('Formsy does not have the validation rule: ' + validationMethod);
        }

        if (typeof validations[validationMethod] === 'function') {
          var validation = validations[validationMethod](currentValues, value);
          if (typeof validation === 'string') {
            results.errors.push(validation);
            results.failed.push(validationMethod);
          } else if (!validation) {
            results.failed.push(validationMethod);
          }
          return;

        } else if (typeof validations[validationMethod] !== 'function') {
          var validation = validationRules[validationMethod](currentValues, value, validations[validationMethod]);
          if (typeof validation === 'string') {
            results.errors.push(validation);
            results.failed.push(validationMethod);
          } else if (!validation) {
            results.failed.push(validationMethod);
          } else {
            results.success.push(validationMethod);
          }
          return;

        }

        return results.success.push(validationMethod);

      });
    }

    return results;
  }

  getModel () {
    const currentValues = this.getCurrentValues();
    return this.mapModel(currentValues);
  }

  mapModel (model) {
    if (this.props.mapping) {
      return this.props.mapping(model);
    } else {
      return formDataToObject.toObj(Object.keys(model).reduce((mappedModel, key) => {
        const keyArray = key.split('.');
        let base = mappedModel;

        while (keyArray.length) {
          const currentKey = keyArray.shift();
          base = (base[currentKey] = keyArray.length ? base[currentKey] || {} : model[key]);
        }

        return mappedModel;
      }, {}));
    }
  }
 
  handleSubmit (event) {
    event && event.preventDefault();
    
    this.validateForm();
  }

  render () {
    const {
      onInvalidSubmit,
      onValidSubmit,
      onValid,
      onInvalid,
      onSuccess,
      validationErrors,
      children,
      ...props
    } = this.props;

    return (
      <form {...props} onSubmit={this.handleSubmit}>
        {this.props.children}
      </form>
    );
  }
}

RForm.propTypes = {
  children: PropTypes.node
}

RForm.defaultProps = {
  onSuccess: function () {},
  onError: function () {},
  onSubmit: function () {},
  onValidSubmit: function () {},
  onInvalidSubmit: function () {},
  onValid: function () {},
  onInvalid: function () {},
  onChange: function () {},
  validationErrors: null
}


RForm.childContextTypes = {
  form: React.PropTypes.object
}

export default RForm;
