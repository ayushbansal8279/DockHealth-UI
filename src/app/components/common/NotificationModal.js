import React from 'react'

class NotificationModal extends React.Component {
  render(){
    return(
      <div className="reveal text-center" id={"notification-modal-" + this.props.uniqueId} data-reveal="">
        <h5 className="margin-bottom">{this.props.message}</h5>
        <div className="button-wrapper">
          <span data-close="" className="button medium confirm">Got it</span>
        </div>
        <button className="close-button" data-close="" aria-label="Close modal" type="button">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    )
  }
}

export default (NotificationModal)
