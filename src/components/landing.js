import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory  } from 'react-router';
// import * as actions from '../../actions';



class Landing extends Component{

  componentWillMount(){
     const authStatus =this.props.authStatus;

    if(authStatus){
      browserHistory.push('/home');
    }

  }


  render(){


    return(
      <div>
          <header className="header-image">
            <div className="headline">
              <div className="container">
                <h1>theme<span className="bold">REACT</span></h1>
              </div>
            </div>
          </header>
          <div className="features">
          </div>
        </div>
    );

  }

}

function mapStateToProps(state){
  return{
    authStatus: state.auth.authenticated,
  }
}

export default connect(mapStateToProps)(Landing);
