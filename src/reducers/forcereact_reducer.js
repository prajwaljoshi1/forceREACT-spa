import {  FETCH_TASKS , FETCH_TASK, FETCH_EVENTS , FETCH_EVENT, FETCH_SALESFORCEORGS , ACTIVE_SALESFORCEORG } from '../actions/types';

const INITIAL_STATE = { allTasks : [],
                        task : {},
                        allEvents:[],
                        event:{},
                        allSalesforceOrgs:[],
                        activeSalesforceOrg:{}
                       }

export default function(state = INITIAL_STATE, action ){
  switch(action.type){
    case FETCH_TASK:
    {
      return {...state, task:action.payload};
    }
    case FETCH_TASKS:
        {
          return  {...state, allTasks:action.payload};
        }
    case FETCH_EVENT:
        {
          return {...state, event:action.payload};
        }
      case FETCH_EVENTS:
            {
              return  {...state, allEvents:action.payload};
            }
            case FETCH_SALESFORCEORGS:
            {
              return {...state, allSalesforceOrgs:action.payload};
            }
            case ACTIVE_SALESFORCEORG:
                {
                  return  {...state, activeSalesforceOrg:action.payload};
                }
  }

    return  state;
}
