import axios from 'axios';
import API from '../../api-url';
import { browserHistory  } from 'react-router';





export function signinToSalesforce({id, password}){


    return function(dispatch){

      console.log("SALESFORCE SIGNUP CODE GOES HERE");
      
      browserHistory.push('/dashboard');

    }

}
