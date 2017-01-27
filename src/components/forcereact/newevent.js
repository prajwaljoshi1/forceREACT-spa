import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import * as actions from '../../actions/forcereact/event';
import ObjectSelect from '../object_select';

import HeaderUser from '../header-user';

    //HARDCODED FOR NOW

  const allTasks = [
  { id: 1, label: 'Task1'},
  { id: 2, label: 'Task2' },
  { id: 3, label: 'Task3' }
]







class NewEvent extends Component{


  handleFormSubmit(formProps){
    this.props.createNewEvent({
        eventName : formProps.eventName,
        description : formProps.description,
        taskAttached : formProps.taskAttached,
        timeInterval:formProps.timeInterval,
        timesPer: formProps.timesPer,
        days: {
          monday:formProps.monday,
          tuesday:formProps.tuesday,
          wednesday:formProps.wednesday,
          thursday:formProps.thursday,
          friday:formProps.friday,
          saturday:formProps.saturday,
          sunday:formProps.sunday
        }
    });
  }


  renderAlert(){
    if(this.props.errorMessage){
      return(
            <div className="alert alert-danger ">
                {this.props.errorMessage}
            </div>
      );
    }
  }

  render(){

    const { handleSubmit , fields : { eventName, description , taskAttached, timeInterval, timesPer, monday, tuesday, wednesday, thursday, friday ,saturday, sunday }} = this.props;
    return (
            <div>
              <HeaderUser/>
              <h3 className="page-title"> Create New Event </h3>

              <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>

                  <fieldset className="form-group">
                    <label>Event Name:</label>
                    <input className="form-control"   {...eventName}/>
                    {eventName.touched && eventName.error  && <div className="error">{eventName.error}</div>}
                  </fieldset>

                  <fieldset className="form-group">
                    <label>Description:</label>
                    <textarea  className="form-control" {...description} value={description.value || ''}/>
                    {description.touched && description.error  && <div className="error">{description.error}</div>}
                  </fieldset>

                  <fieldset className="form-group">
                    <label> Task Attached:</label>
                    <div>
                    <ObjectSelect className="form-control"  options={allTasks} {...taskAttached}/>
                    </div>
                    {taskAttached.touched && taskAttached.error  && <div className="error">{taskAttached.error}</div>}
                  </fieldset>

                  <fieldset className="form-group">
                      <label>Time Interval:</label>
                    <br/>
                    <label>Rate:</label>
                    <select className="form-control" {...timesPer} value={timesPer.value || ''}>
                      <option value="HOURLY">Hourly</option>
                      <option value="DAILY">Daily</option>
                      <option value="WEEKLY">Weekly</option>
                    </select>
                    <label>Times:</label>
                    <select className="form-control" {...timeInterval} value={timeInterval.value || ''}>
                      <option value="1">1</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                      <option value="18">24</option>
                    </select>
                    {timeInterval.touched && timeInterval.error  && <div className="error">{timeInterval.error}</div>}

                      <label>Days:</label><br/>
                      <label><input type="checkbox"  {...monday}/> Monday </label><br/>
                      <label><input type="checkbox" {...tuesday}/> Tuesday </label><br/>
                      <label><input type="checkbox" {...wednesday}/> Wednesday </label><br/>
                      <label><input type="checkbox" {...thursday}/> Thursday </label><br/>
                      <label><input type="checkbox" {...friday}/> Friday </label><br/>
                      <label><input type="checkbox" {...saturday}/> Saturday </label><br/>
                      <label><input type="checkbox" {...sunday}/> Sunday </label><br/>

                  </fieldset>


                  <fieldset>
                  {this.renderAlert()}
                    </fieldset>
                  <button action="submit" className="btn btn-primary">Sign up!</button>
              </form>
            </div>
          );
  }
}


function validate(formProps){
  const errors = {};

    if(!formProps.eventName){
      errors.eventName = 'Please enter a valid Event Name'
    }


    if(!formProps.taskAttached){
      errors.taskAttached = 'Please attach a task'
    }

    if(!formProps.timeInterval){
      errors.timeInterval = 'Please give a time interval'
    }

  return errors;
}

function mapStateToProps(state){
  return {errorMessage:state.auth.error}
}


export default reduxForm({
  form:'newEvent',
  fields:['eventName', 'description','taskAttached','timeInterval', 'timesPer','monday', 'tuesday','wednesday', 'thursday', 'friday' ,'saturday', 'sunday' ],
  validate
}, mapStateToProps, actions)(NewEvent);
