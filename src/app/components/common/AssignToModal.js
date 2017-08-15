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
  }

  componentDidMount(){
    this.setState({members:this.props.members})
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.members != this.props.members){
      this.setState({members:nextProps.members})
    }
  }

  render() {
    return (
      <div className="reveal" id={"edit-assign-to-" + this.props.task.taskId} data-reveal="">
        <h5 className="margin-bottom text-center">Assign to</h5>
        <div className="scroll-wrapper">
          {this.state.members && this.state.members.map(member=>{
            return(
              <div data-close="" onClick={(e) => this.props.assignOrReassignTask(this.props.task, member.userId, member)} key={'assign_'+this.props.taskListId+'_'+member.userId} className="row condense expanded border-bottom align-middle">
                <div className="columns shrink">
                  <MemberInitials member={member}/>
                  {/* <img className="member-photo circle medium" src="assets/img/user3.png" alt="name of user"/> */}
                </div>
                <div className="columns">
                  <span className="item-content">{member.userName}</span>
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
    </div>
    )
  }

}


export default AssignToModal;
