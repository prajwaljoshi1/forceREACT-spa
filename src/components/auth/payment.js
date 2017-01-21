import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import * as actions from '../../actions';

class Payment extends Component{

  handleFormSubmit(formProps){

  this.props.setStripeToken({cardNumber:formProps.cardNumber, CVC:formProps.CVC, expirationMonth:formProps.expirationMonth, expirationYear:formProps.expirationYear})
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

    const { handleSubmit, fields: {cardNumber,CVC,expirationMonth,expirationYear}} = this.props;

    return(
        <div className="container">
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>

          <fieldset className="form-group">
            <label>Card Number:</label>
            <input className="form-control"   {...cardNumber} data-stripe="number"/>
            {cardNumber.touched && cardNumber.error  && <div className="error">{cardNumber.error}</div>}
          </fieldset>

          <fieldset className="form-group">
            <label>CVC:</label>
            <input className="form-control"   {...CVC} data-stripe="cvc"/>
            {CVC.touched && CVC.error  && <div className="error">{CVC.error}</div>}
          </fieldset>

            <label>Expiration Date:</label>

          <fieldset className="form-group">
            <label>Month:</label>
            <input className="form-control"   {...expirationMonth} data-stripe="exp-month"/>
            {expirationMonth.touched && expirationMonth.error  && <div className="error">{expirationMonth.error}</div>}
          </fieldset>

          <fieldset className="form-group">
            <label>Year:</label>
            <input className="form-control"   {...expirationYear} data-stripe="exp-year"/>
            {expirationYear.touched && expirationYear.error  && <div className="error">{expirationYear.error}</div>}
          </fieldset>

          <fieldset>
          {this.renderAlert()}
            </fieldset>
          <button action="submit" className="btn btn-primary">Send Details</button>
      </form>
    </div>);
  }
}


function validate(formProps){
  const errors = {};

    if(!formProps.cardNumber){
      errors.cardNumber = 'Please enter a valid card number'
    }


    if(!formProps.CVC){
      errors.CVC = 'Please enter a valid CVC'
    }

    if(!formProps.expirationYear){
      errors.expirationYear = 'Please enter your expiration year'
    }

    if(!formProps.expirationMonth){
      errors.expirationMonth = 'Please enter your expiration month'
    }


  return errors;
}

function mapStateToProps(state){
  return {
    errorMessage:state.auth.error,


  }
}

export default reduxForm({
  form :'paymant',
  fields:['cardNumber','CVC','expirationMonth', 'expirationYear'],
  validate
}, mapStateToProps, actions)(Payment);
