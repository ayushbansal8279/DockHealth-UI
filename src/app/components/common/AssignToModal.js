import React from 'react'
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form'
import BaseComponent from '../BaseComponent'
import $ from 'jquery'

//let AddTaskForm = props => {
class AssignToModal extends BaseComponent {
  constructor(props, container) {
		super(props)
    this.state = {
      members: [],
      taskListId: ""
    }
	}

  componentDidMount () {
    this.setState({members: this.props.members})
    this.setState({taskListId: this.props.taskListId})
  }

  componentDidUpdate () {
  }

  componentWillReceiveProps(newProps) {
    if(newProps.params.taskListId != this.state.taskListId){
      console.log(newProps)
      this.setState({taskListId: newProps.taskListId})
      this.setState({members: newProps.members});
    }
}

  render() {
    return (
      <div className="reveal" id="edit-assign-to" data-reveal>
        <h5>{this.state.taskListId}</h5>
        <h5 className="margin-bottom text-center">Assign to</h5>
        <div className="scroll-wrapper">

          {this.state.members.map(member=>{
            return(
              <div key={member.userId} className="row condense expanded border-bottom align-middle">
                <div className="columns shrink">
                  <img className="member-photo circle medium" src="assets/img/user3.png" alt="name of user"/>
                </div>
                <div className="columns">
                  <span className="item-content">{member.userName}</span>
                </div>
              </div>
            )
          })}
          {/* <div className="row condense expanded border-bottom align-middle">
            <div className="columns shrink">
              <img className="member-photo circle medium" src="assets/img/user2.png" alt="name of user"/>
            </div>
            <div className="columns">
              <span className="item-content">Jenny Davis</span>
            </div>
          </div>
          <div className="row condense expanded border-bottom align-middle">
            <div className="columns shrink">
              <img className="member-photo circle medium" src="assets/img/user1.png" alt="name of user"/>
            </div>
            <div className="columns">
              <span className="item-content">Christopher Richardson</span>
            </div>
          </div>
          <div className="row condense expanded border-bottom align-middle">
            <div className="columns shrink">
              <span className="member-initials circle medium">SL</span>
            </div>
            <div className="columns">
              <span className="item-content">Samuel Lowe</span>
            </div>
          </div>
          <div className="row condense expanded border-bottom align-middle">
            <div className="columns shrink">
              <span className="member-initials circle medium">JO</span>
            </div>
            <div className="columns">
              <span className="item-content">Jack Oliver</span>
            </div>
          </div>
          <div className="row condense expanded border-bottom align-middle">
            <div className="columns shrink">
              <span className="member-initials circle medium">PG</span>
            </div>
            <div className="columns">
              <span className="item-content">Peter Gonzales</span>
            </div>
          </div>
        </div> */}
        <form className="inline-label top-buffer">
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
        </form>
        <div className="row collapse expanded align-middle">
          <div className="columns text-center">
            <a className="button secondary medium">Save</a>
          </div>
        </div>
        <button className="close-button" data-close aria-label="Close modal" type="button">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
    )
  }
}

AssignToModal = reduxForm({
  // a unique name for the form
  form: 'assignToModal',
  enableReinitialize : true
})(AssignToModal)


const mapStateToProps = function(store) {
  return {
		// initialValues: initialTaskFormValues
  }
};

export default connect(mapStateToProps)(AssignToModal);
