import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import NavBar from '../components/common/NavBar'
import Header from '../components/common/Header'
import BaseComponentWithFoundationUpdate from '../components/BaseComponentWithFoundationUpdate'
// import {mobileAnalyticsClient} from '../api/analytics-api'

class SupportSectionView extends BaseComponentWithFoundationUpdate {

    constructor(props){
      super(props)
      this.state = {
      }
    }
    componentDidMount(){
			// mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
			// 				'PageName': 'AllPatients'
			// });
    }

    render() {
    return (
      <div className="off-canvas-content" data-off-canvas-content>
        <div className="row expanded collapse">
          <div className="large-12 columns">
            <header className="nav-down">
              <div className="top-bar">
                <div className="top-bar-left">
                  <button className="menu-icon hide-for-medium" type="button" data-toggle="sidebar"></button>
                  <h3>DockHealth Support</h3>
                </div>
              </div>
            </header>
            <div className="list-wrapper">
              <div className="row expanded">
                <h5>For DockHealth support, email us at:</h5><br/>
                <a href="mailto:someone@example.com?Subject=Hello%20again" target="_top">support@dockhealth.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

const mapStateToProps = function (store) {
  return{
  }
}

const mapDispatchToProps = function (dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SupportSectionView);

// AllPatientsView.route = {
//   path: 'patientList',
//   component: AllPatientsView
// }
