import axios from 'axios';

import {  FETCH_TASKS , FETCH_TASK } from '../types';


export function fetchAllTasks(){

      // const TESTURL = 'http://reduxblog.herokuapp.com/api/posts?key=sdfdsfsd';

      const tasks = [
                        { 'id':1, 'name': 'Task One', 'description':'The first task'},
                        {'id':2, 'name': 'Task Two', 'description':'The second task'},
                        {'id':3, 'name': 'Task Three', 'description':'The third task'},
                        {'id':4, 'name': 'Task Four', 'description':'The fourth task'},
                        {'id':5, 'name': 'Task Five', 'description':'The fifth task'}
                      ]

  return function(dispatch){
        dispatch({
          type:FETCH_TASKS,
          payload: tasks
        });
  }
}

export function fetchTask(id) {
  const task  = { 'id': id, 'name': 'Task number '+ id, 'description':'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}
  return function(dispatch){
    dispatch({
      type: FETCH_TASK,
      payload:task
    });
  }
}
