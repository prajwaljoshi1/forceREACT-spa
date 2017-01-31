import axios from 'axios';

import {  FETCH_SALESFORCEORGS , ACTIVE_SALESFORCEORG  } from '../types';
import { browserHistory  } from 'react-router';

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


export function loginToSalesForceOrg(id){

  console.log("ERE");
  const salesforceOrgs = {
                            "1" : { id:"1", 'name': 'ORG ONE' },
                            "2" : { id:"2", 'name': 'ORG TWO' }
                          }

  const activeSalesforceOrg = salesforceOrgs[id]


  return function(dispatch){
              dispatch({
                      type:ACTIVE_SALESFORCEORG,
                      payload:activeSalesforceOrg
                    });

                    const salesforceOrgId =  activeSalesforceOrg
                    localStorage.setItem('salesforceOrg',JSON.stringify(activeSalesforceOrg));

                    browserHistory.push("/dashboard")
              }






}
