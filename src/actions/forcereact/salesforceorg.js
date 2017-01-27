import axios from 'axios';

import {  FETCH_SALESFORCEORGS , ACTIVE_SALESFORCEORG } from '../types';


export function fetchAllSalesforceOrgs(){

      // const TESTURL = 'http://reduxblog.herokuapp.com/api/posts?key=sdfdsfsd';

      const salesforceOrgs = [
                        { 'id':1, 'name': 'ORG ONE'},
                        {'id':2, 'name': 'ORG TWO'}

                      ]

  return function(dispatch){
        dispatch({
          type:FETCH_SALESFORCEORGS,
          payload: salesforceOrgs
        });
  }
}
