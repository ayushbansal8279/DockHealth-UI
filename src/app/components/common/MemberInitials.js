import React from 'react'
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';
import * as PeopleActions from '../../actions/people-actions'

class MemberInitials extends React.Component {

  componentDidMount(){
    // if(this.props.member){
    //   var member = this.props.member
    //   if(!this.props.member.avatar){
        // this.props.peopleActions.getUserAvatar(this.props.member)
    //   }
    // }
  }

  render(){
    return(
      <span>
        {this.props.member && this.props.member.profileThumbnailPictureHash ?
          <img className="member-photo circle" src={process.env.HEYDOC_SERVICES_BASE_URL +"user/profilePicture/"+this.props.member.userId+"/"+this.props.member.profileThumbnailPictureHash} alt="name of user"/> :
          <span className="member-initials circle" data-tooltip tabIndex="2" title={this.props.member ? this.props.member.userName : "unassigned"}>{this.props.member ? this.props.member.initials : "?"}</span>
        }
      </span>
    )
  }

}

function mapDispatchToProps(dispatch) {
  return {
	  peopleActions: bindActionCreators(PeopleActions, dispatch)
  }
}

export default connect(undefined, mapDispatchToProps)(MemberInitials)
