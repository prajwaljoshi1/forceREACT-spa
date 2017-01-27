import React , {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchAllEvents } from '../../actions/forcereact/event';
import { Link } from 'react-router';

import HeaderUser from '../header-user';


class Events extends Component{

  componentWillMount(){
    this.props.fetchAllEvents();
  }


  renderList(){
    return this.props.events.map((event) => {
      return(
        <li className="list-group-item index-list" key={event.id}>
          <Link to={"events/"+event.id} className="index-link">
            <h4><strong>{event.name}</strong></h4>
            <p >{event.description}</p>
          </Link>
        </li>

      )
    });
  }

render(){

  return(
      <div>
        <HeaderUser/>
        <div className="text-right">
        <Link to="/events/new" className="btn btn-outline-primary">
         Add a new Event
         </Link>
         </div>
          <h3 className="page-title">List of all your Events</h3>
          <ul className="list-group">
           {this.renderList()}
          </ul>
      </div>
    )
  }

}

function mapStateToProps(state){
  return{
    events: state.forcereact.allEvents,
  }
}


export default connect(mapStateToProps, {fetchAllEvents})(Events);
