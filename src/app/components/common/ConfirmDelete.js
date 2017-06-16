import React from 'react'

class ConfirmDelete extends React.Component {
  render(){
    return(
      <div class="reveal text-center" id="delete-task-01" data-reveal>
        <h5 class="margin-bottom">Are you sure you want to delete this task?</h5>
        <div class="button-wrapper">
          <a class="button medium confirm">Delete</a>
          <a class="button medium cancel">Cancel</a>
        </div>
        <button class="close-button" data-close aria-label="Close modal" type="button">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    )
  }
}

export default (ConfirmDelete)
