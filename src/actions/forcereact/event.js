import axios from 'axios';

import {  FETCH_EVENTS , FETCH_EVENT } from '../types';


export function fetchAllEvents(){

      // const TESTURL = 'http://reduxblog.herokuapp.com/api/posts?key=sdfdsfsd';

      const events = [
                        { 'id':1, 'name': 'Event One', 'description':'The first Event'},
                        {'id':2, 'name': 'Event Two', 'description':'The second Event'},
                        {'id':3, 'name': 'Event Three', 'description':'The third Event'},
                        {'id':4, 'name': 'Event Four', 'description':'The fourth Event'},
                        {'id':5, 'name': 'Event Five', 'description':'The fifth Event'}
                      ]

  return function(dispatch){
        dispatch({
          type:FETCH_EVENTS,
          payload: events
        });
  }
}

export function fetchEvent(id) {
  const event  = { 'id': id, 'name': 'Event number '+ id, 'description':'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}
  return function(dispatch){
    dispatch({
      type: FETCH_EVENT,
      payload:event
    });
  }
}

export function createNewEvent(o){
  console.log(o);
}
