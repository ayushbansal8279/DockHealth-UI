import React from 'react';
import BaseComponent from '../BaseComponent'
import MemberInitials from './MemberInitials'

//let AddTaskForm = props => {
class AssignToModal extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      members:[]
    }
    this.handleMemberAssignment = this.handleMemberAssignment.bind(this)
  }

  componentDidMount(){
    this.setState({members:this.props.members})
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.members != this.props.members){
      this.setState({members:nextProps.members})
    }
  }

  componentWillUpdate (nextProps) {
    console.log('AssignToModal componentWillUpdate: ')
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("AssignToModal didUpdate")
  }

  handleMemberAssignment(member) {
    // console.log('handleMemberAssignment')
    if(member){
      this.props.assignOrReassignTask(this.props.task, member.userId, member)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(!this.props.task
      || (nextProps.task && this.props.task.taskId != nextProps.task.taskId)
      || (nextProps.task && this.props.task.assignedTo != nextProps.task.assignedTo)
      || (nextState.members && this.state.members.length != nextState.members.length)){ //since we are using state to render
      return true
    }
    return false
  }

  render() {
    return (
        <div className="reveal" id={"edit-assign-to-" + this.props.task.taskId} data-reveal="">
        {/* <div id={"edit-assign-to-" + this.props.task.taskId}> */}
        <h5 className="margin-bottom text-center">Assign to</h5>
        <div className="scroll-wrapper">
          {this.props.members && this.props.members.map(member=>{
            // return(member.status!='PENDING' && // PENDING members can be assigned tasks
            return(
              <div data-close="" 
                onClick={(e) => this.handleMemberAssignment(member)} 
                key={'assign_'+this.props.taskListId+'_'+member.userId} 
                className="row condense expanded border-bottom align-middle">
                <div className="columns shrink">
                  <MemberInitials member={member}/>
                  {/* <img className="member-photo circle medium" src="assets/img/user3.png" alt="name of user"/> */}
                </div>
                <div className="columns">
                  <span className="item-content">{member.userName}</span>
                  <span className="item-details">{member.taskListUserRole}</span>
									{member.status == "PENDING" &&
									<span className="item-details highlight">Invited</span>
									}
                </div>
              </div>
            )
          })}
        {/* <form className="inline-label top-buffer">
          <div className="row collapse expanded align-middle">
            <div className="columns input-group input-wrapper">
              <span className="input-group-label">
                <svg className="icon"><use xlinkHref="#icon-search"></use></svg>
              </span>
              <div className="input-wrapper">
                <input id="add-member-to-list" className="assign-to input-group-field" type="text" placeholder="Add a new member"/>
              </div>
            </div>
          </div>
        </form> */}
        {/* <div className="row collapse expanded align-middle">
          <div className="columns text-center">
            <a className="button secondary medium">Save</a>
          </div>
        </div> */}
        <button className="close-button" data-close="" aria-label="Close modal" type="button">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      {this.props.task.assignedTo != null &&
        <div data-close="" onClick={(e) => this.props.assignOrReassignTask(this.props.task, -1, null)} className="small-link pointer">Unassign task</div>
      }
    </div>
    )
  }

}

export default AssignToModal;
