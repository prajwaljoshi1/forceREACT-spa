import React, { Component} from 'react';
import {reduxForm } from 'redux-form';
import * as actions from '../../actions';

class Signin extends Component{

  handleFormSubmit({email, password}){
    console.log(email, password);
    this.props.signinUser({email:email, password:password})

  }

  renderAlert(){
    if(this.props.errorMessage){
      return(
            <div className="alert alert-danger">
                {this.props.errorMessage}
            </div>
      );
    }
  }

  render(){
    const { handleSubmit, fields:{ email, password }} = this.props;

    return(
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <fieldset>
        <label>Email:</label>
        <input {...email} className="form-control" />
        </fieldset>
        <fieldset>
        <label>Password:</label>
        <input {...password} className="form-control" />
        </fieldset>
        <fieldset>
        {this.renderAlert()}
          </fieldset>
        <button action="submit"  className="btn btn-primary">Sign in</button>
      </form>)
  }

}


function mapStateToProps(state){
  return{
    errorMessage: state.auth.error
  }
}

export default reduxForm({
  form:'Signin',
  fields: ['email', 'password']
}, mapStateToProps, actions)(Signin);
