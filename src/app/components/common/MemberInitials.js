import React from 'react'

class MemberInitials extends React.Component{

  render(){
    return(
      <span>
        {this.props.member ?
          <span className="member-initials circle medium" data-tooltip tabIndex="2" title={this.props.member.userName}>{this.props.member.initials}</span> :
          <span className="member-initials circle medium" data-tooltip tabIndex="2" title="unassigned">?</span>
        }
      </span>
    )
  }

}

export default MemberInitials
