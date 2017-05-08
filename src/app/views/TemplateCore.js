import React from 'react'
import PropTypes from 'prop-types';
import NavBar from '../components/common/NavBar'
import Header from '../components/common/Header'
import Notification from '../components/common/Notification'
import { Link, browserHistory, hashHistory } from 'react-router'
import { connect } from 'react-redux'
import * as userApi from '../api/user-api'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      user: false
    }
  }

  render() {
    return (    
        <div>        
          <NavBar />
          <Header />
          {this.props.children}

          <Notification />
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
            console.log(data);
          })
      }
  }
//)
}

App.propTypes = {
  children: PropTypes.object.isRequired
};

const mapStateToProps = function (store) {
  return {
    user: store.userState.user
  }
}

export default connect(mapStateToProps)(App)

//export default App