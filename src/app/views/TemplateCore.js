import React from 'react'
import PropTypes from 'prop-types';
import NavBar from '../components/common/NavBar'
import Header from '../components/common/Header'
import {bindActionCreators} from 'redux'
import Notification from '../components/common/Notification'
import { Link, browserHistory, hashHistory } from 'react-router'
import { connect } from 'react-redux'
import * as userApi from '../api/user-api'
import * as TaskListActions from '../actions/tasklist-actions'
import {mobileAnalyticsClient} from '../api/analytics-api'
// import * as TaskActions from '../actions/task-actions'

class TemplateCore extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      user: false
    }
  }

  render() {
    const NavLink = ({to, children, className}) => (
      <li>
        <Link activeClassName="active" className={className} to={to}>
          {children}
        </Link>
      </li>
    )
    return (
        <div>
          <NavBar/>
          <div className="small dropdown-pane" id="profile-dropdown" data-v-offset="0" data-h-offset="0" data-dropdown data-hover="true" data-hover-pane="true">
            <ul className="menu vertical">
              <NavLink to="/userprofile">View and edit profile</NavLink>
              {/* <li><a href="terms2.html">Terms and conditions</a></li> */}
              <NavLink to="/logout">Logout</NavLink>
            </ul>
          </div>
          {this.props.children}
          {/*<Notification />*/}
        </div>
    );
  }

  componentWillMount() {
    userApi.isAuthenticated(this)
  }

  componentDidMount () {
    this.props.taskListActions.getTaskListForUser()
    // this.renderFoundationComponents();
  }

  componentDidUpdate () {
    // this.renderFoundationComponents();
  }

  renderFoundationComponents () {
  // render the buy button with jQuery
  //$(this.refs.container).html(
    renderFoundationComponentsJquery();
  //);
  }

 getBrowserInfo() {
    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
        return {name:'IE',version:(tem[1]||'')};
        }
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR|Edge\/(\d+)/)
        if(tem!=null)   {return {name:'Opera', version:tem[1]};}
        }
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return {
      name: M[0],
      version: M[1]
    };
 }

  isLoggedIn(message, isLoggedIn, cognitoUser) {
      if (!isLoggedIn) {
        console.log('not logged in')
        hashHistory.push('login')
      } else {
        if(!this.props.user){
          this.state.user = cognitoUser
          //TODO - fix this hack
          userApi.updateStoreWithCurrentUser(cognitoUser)
        }else{
          this.state.user = this.props.user
        }
        console.log('logged in: '+cognitoUser.username)
        var browser=this.getBrowserInfo();
        mobileAnalyticsClient.recordEvent('BROWSER_INFO', {
            'Name': browser.name,
            'Version':browser.version
        });

        //check if user exists
        userApi.getUserByEmail(cognitoUser.username, cognitoUser)
          .then(data => {
            if(!data.organizationId){
              hashHistory.push('/errorPage');
            }
            //userId, pictureType
            userApi.getUserProfilePic(data.userId,"PROFILE")
            .then((datapic) =>{
              //console.log (datapic);
            })
            //console.log(data);
          })
      }
  }
//)
}

TemplateCore.propTypes = {
  children: PropTypes.object.isRequired
};

const mapStateToProps = function (store) {
  // console.log('tasklist is: ' + store.taskListState.tasklistone.listName)
  return {
    user: store.userState.user,
  }
}

const mapDispatchToProps = function (dispatch) {
  return {
    taskListActions: bindActionCreators(TaskListActions, dispatch)
    // taskActions: bindActionCreators(TaskActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TemplateCore)

//export default App
