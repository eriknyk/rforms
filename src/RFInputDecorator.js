import React, { Component, PropTypes } from 'react';
import RFInputHOC from './RFInputHOC';

export default function RFInputDecorator() {
  return function (Component) {
    return RFInputHOC(Component);
  }
}
