import React, { Component } from 'react';

import Header from './header';
import Navigation from './navigation';

export default class Home extends Component {
  render() {
    return (
      <div className="application-wrapper">
          <Navigation />
          <div className="page-content-wrapper">
          {this.props.children}
          </div>

      </div>
    );
  }
}
