import React from 'react'

class MemberInitials extends React.Component{

  render(){
    return(
      <span>
        {this.props.member ?
          <span className="member-initials circle medium">{this.props.member.initials}</span> :
          <span className="member-initials circle medium">?</span>
        }
      </span>
    )
  }

}

export default MemberInitials
