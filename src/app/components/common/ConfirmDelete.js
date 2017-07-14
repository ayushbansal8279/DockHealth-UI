import React from 'react'

class ConfirmDelete extends React.Component {
  render(){
    return(
      <div className="reveal text-center" id={"delete-task-"+this.props.task.taskId} data-reveal>
        <h5 className="margin-bottom">Are you sure you want to delete this task?</h5>
        <div className="button-wrapper">
          <span onClick={(e) => this.props.handleDeleteTask(this.props.task)} className="button medium confirm">Delete</span>
          <a className="button medium cancel">Cancel</a>
        </div>
        <button className="close-button" data-close aria-label="Close modal" type="button">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    )
  }
}

export default (ConfirmDelete)
