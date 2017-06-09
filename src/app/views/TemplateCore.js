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
import * as TaskActions from '../actions/task-actions'

class TemplateCore extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      user: false
    }
  }

  render() {

    return (
        <div>
          <NavBar/>
          <div className="off-canvas-content" data-off-canvas-content="true">
            <div className="row expanded collapse">
              <div className="large-12 columns">
                <Header taskListId={this.props.params.taskListId}/>
                {this.props.children}
              </div>
            </div> 
          </div> 
          {/*<Notification />*/}
        </div>
    );
  }

  componentWillMount() {
    userApi.isAuthenticated(this)
  }

  componentDidMount () {
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
        //check if user exists
        userApi.getUserByEmail(cognitoUser.username, cognitoUser)
          .then(data => {
            userApi.getUserProfilePic()
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
    taskListActions: bindActionCreators(TaskListActions, dispatch),
    taskActions: bindActionCreators(TaskActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TemplateCore)

//export default App
