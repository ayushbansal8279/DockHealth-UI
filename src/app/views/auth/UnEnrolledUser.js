import React from 'react'
import { Link, browserHistory, hashHistory } from 'react-router'
import { SubmissionError } from 'redux-form'
import * as userApi from '../../api/user-api'
import { error, success } from '../../actions/notification-actions'
import {mobileAnalyticsClient} from '../../api/analytics-api'

export default class UnEnrolledUser extends React.Component {
  constructor (props) {
    super(props)
  }

  componentWillMount() {
  }

  render () {

    return (
      <div className="wrapper columns large-12">
          <div className="row expanded text-center">
            <div className="columns large-12 top-buffer">
              <h5>Security and protected health information is important to us. We noticed your email address is not associated with an organization that has been given access to Dock Health</h5>
            </div>
          </div>
          <div className="row expanded text-center">
            <div className="columns large-12 top-buffer">
              <h5>We will send an email to you with a few quick steps to gain access. Please check for an email from Dock Health shortly</h5>
              <h5>For questions please contact us at <a href="mailto:support@dock.health">support@dock.health</a></h5>
            </div>
          </div>
          <div className="row expanded">
            <div className="columns large-12 top-buffer text-right details">
              <h4 className='subtitle'><Link to="/logout">Logout here</Link></h4>
            </div>
          </div>

      </div>
    )
  }
}
