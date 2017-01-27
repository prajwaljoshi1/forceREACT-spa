import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchTask } from '../../actions/forcereact/task';

import HeaderUser from '../header-user';


class  Task extends Component{

  componentWillMount(){
    this.props.fetchTask(this.props.params.id)
  }

  render() {

    const { task } = this.props;
    console.log(this.props);
    return (
      <div>
          <HeaderUser/>
          <h3>{task.name}</h3>
           <p>{task.description}</p>

     </div>
   );
  }

}


function mapStateToProps(state){
  return{ task : state.forcereact.task}
}


export default connect (mapStateToProps, {fetchTask}) (Task)
