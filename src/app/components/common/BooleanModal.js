import React from 'react'

class BooleanModal extends React.Component {

  confirm = (boolean) => {
    alert(boolean)
  }

  render(){
    return(
      <div className="reveal text-center" id="delete-task-01" data-reveal>
        <h5 className="margin-bottom">Are you sure you want to delete this task?</h5>
        <div className="button-wrapper">
          <div onClick={(e)=>this.confirm(true)}><a className="button medium confirm">Delete</a></div>
          <div onClick={(e)=>this.confirm(false)}><a className="button medium cancel">Cancel</a></div>
        </div>
        <button className="close-button" data-close aria-label="Close modal" type="button">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    )
  }
}

export default BooleanModal
