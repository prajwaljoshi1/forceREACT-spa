import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchEvent } from '../../actions/forcereact/event';
import HeaderUser from '../header-user';


class  Event extends Component{

  componentWillMount(){
    this.props.fetchEvent(this.props.params.id)
  }

  render() {

    const { event } = this.props;
    return (
      <div>
          <HeaderUser/>
          <h3>{event.name}</h3>
          <p>{event.description}</p>
     </div>
   );
  }

}


function mapStateToProps(state){
  return{ event : state.forcereact.event}
}


export default connect (mapStateToProps, {fetchEvent}) (Event)
