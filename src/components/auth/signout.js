import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';


class Signout extends Component{


  componentWillMount(){
    console.log("SIGN OUT USER");
    this.props.signoutUser();
  }

  render(){
    return (
      <div> See You</div>
    );
  }

}


export default connect(null,actions)(Signout);
