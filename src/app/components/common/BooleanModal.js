import React from 'react'

class BooleanModal extends React.Component {

  render(){
    return(
      <div className="reveal text-center" id={this.props.uniqueModalId} data-reveal>
        <h5 className="margin-bottom">{this.props.message}</h5>
        <div className="button-wrapper">
          <span onClick={(e) => this.props.handleConfirmation(this.props.handleConfirmationArgs)} className="button medium confirm">{this.props.confirmBtnTxt}</span>
          <a className="button medium cancel">Cancel</a>
        </div>
        <button className="close-button" data-close aria-label="Close modal" type="button">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    )
  }
}

export default BooleanModal
