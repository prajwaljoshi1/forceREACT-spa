import React , {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchAllTasks } from '../../actions/forcereact/task';
import { Link } from 'react-router';

import HeaderUser from '../header-user';


class Tasks extends Component{

  componentWillMount(){
    this.props.fetchAllTasks();
  }


  renderTasks(){
    return this.props.tasks.map((task) => {
      return(
        <li className="list-group-item index-list" key={task.id}>
          <Link to={"tasks/"+task.id} className="index-link">
            <h4><strong>{task.name}</strong></h4>
            <p >{task.description}</p>
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
        <Link to="/tasks/new" className="btn btn-outline-primary">
         Add a new Task
         </Link>
         </div>
          <h3 className="page-title">List of all your Tasks</h3>
          <ul className="list-group">
           {this.renderTasks()}
          </ul>
      </div>
    )
  }

}

function mapStateToProps(state){
  return{
    tasks: state.forcereact.allTasks,
  }
}


export default connect(mapStateToProps, {fetchAllTasks})(Tasks);
