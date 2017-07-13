import React from 'react'
import * as UserActions from '../../actions/people-actions'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

class MemberProfilePic extends React.Component{


  componentDidMount(){
      this.props.userActions.findAllUsersByOrganizationId()
      // this.props.userActions.getUserById(parseInt(this.props.userId))
  }

  render(){
    return(
      <img className="member-photo circle" src="assets/img/user1.png" alt="name of user"/>
    )
  }

}

// const mapStateToProps = function (store) {
//   return {
//     users: store.userState.users
//   }
// }

const mapDispatchToProps = function (dispatch) {
  return {
    userActions: bindActionCreators(UserActions, dispatch)
  }
}

export default connect(undefined, mapDispatchToProps)(MemberProfilePic)
