import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import * as TaskActions from '../../actions/task-actions'
import {bindActionCreators} from 'redux'

class AddComment extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      addComment: false,
      value: ''
    }
    this.changeCommentStatus = this.changeCommentStatus.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  changeCommentStatus(status){
    this.setState({addComment: status})
    this.commentInput.focus();
  }

  onSubmit(formProps){
    this.props.taskActions.addTaskComment(this.props.task.taskId, formProps)
    this.setState({addComment: false})
    this.setState({value: ''})
  }

  render(){
    return (
      <div className="row expanded collapse comment-wrapper">
        <div className="columns shrink">
          <img className="member-photo circle xsmall" src="assets/img/user1.png" alt="name of user"/>
        </div>
        <div className="columns">
          {this.state.addComment ?
            <form className="inline-label" onSubmit={this.props.handleSubmit(this.onSubmit)}>
              <span id={"comment-form-"+this.props.task.taskId}>
                <Field ref={(commentInput) => { this.commentInput = commentInput; }}  name="comment" type="text" component="input" value={this.state.value} placeholder='Type your comment here...' className="comment"/>
                <button type="submit" className="button primary small">Post</button>
              </span>
            </form> :
            <span>
              <span className="comment text-light">Add a comment...</span>
              <span onClick={(e) => this.changeCommentStatus(true)}>Add</span>
            </span>
          }
        </div>
      </div>
    )
  }


}

const mapDispatchToProps = function (dispatch) {
  return {
    taskActions: bindActionCreators(TaskActions, dispatch)
  }
}

export default connect(undefined, mapDispatchToProps)(reduxForm({
    form: 'AddComment'
})(AddComment));
