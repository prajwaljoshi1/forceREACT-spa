import React, { Component } from 'react';
import Loading from 'react-loading';


export  default class LoadingSign extends Component{

  render(){
    return(
      <Loading  className="loading-sign" type='bars' color='#0275d8' />
    );
  }
}


// var Component = React.createClass({
//   render: function() {
//     return (
//       <Loading type='balls' color='#0275d8' />
//     );
//   }
// });
