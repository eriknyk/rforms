import React, { Component } from 'react';
import RForm from 'rforms';

class Form extends Component {  
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-4">
            <div className="card">
              <div className="card-header">&nbsp;</div>
              <div className="card-block">
                <RForm {...this.props}>
                  {this.props.children}
                </RForm>
              </div>
            </div>
          </div>
        </div>
      </div>  
    );
  }
}

export default Form;
