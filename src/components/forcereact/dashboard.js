import React, { Component } from 'react';
import LoadingSign from '../loading';
import HeaderUser from '../header-user';



export default class Dashboard extends Component {

  componentWillMount(){

  }


  render() {
    return (

      <div>
      <HeaderUser/>
        <LoadingSign/>



      </div>
    );
  }
}
