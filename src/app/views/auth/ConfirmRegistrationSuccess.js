import React from 'react'
import { Link, browserHistory, hashHistory } from 'react-router'
import { SubmissionError } from 'redux-form'
import * as userApi from '../../api/user-api'
import { error, success } from '../../actions/notification-actions'
import {mobileAnalyticsClient} from '../../api/analytics-api'

export default class ConfirmRegistrationSuccess extends React.Component {
  constructor (props) {
    super(props)
  }

  componentWillMount() {
  }

  render () {
    var branchAppLink = process.env.BRANCH_IO_APP_LINK;

    return (
      <div className="wrapper columns large-12">
          <div className="row expanded text-center">
            <div className="columns large-12 top-buffer">
              <h5>Registration confirmed. Please Login.</h5>
            </div>
          </div>

          <div className="row expanded">
            <div className="columns large-12 top-buffer text-center">
              {/* <Link to="/login" className="button secondary expand">Login</Link> */}
              {/* <a href="https://dockdev.app.link/FbMSMrsZLK" className="button secondary expand">Login</a> */}
              <a href={branchAppLink} className="button secondary expand">Login</a>
            </div>
          </div>

      </div>
    )
  }
}
