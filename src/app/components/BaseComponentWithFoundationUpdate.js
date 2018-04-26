import React from 'react'
import * as userApi from '../api/user-api'
import { Link, browserHistory, hashHistory } from 'react-router'
import {mobileAnalyticsClient} from '../api/analytics-api'
import BaseComponent from './BaseComponent'

class BaseComponentWithFoundationUpdate extends BaseComponent {
  
  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState)
    //enableFoundation();
    console.log("BaseComponentWithFoundationUpdate didupdate")
    
  }

}
export default BaseComponentWithFoundationUpdate
