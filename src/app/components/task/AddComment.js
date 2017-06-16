import React from 'react'
import { Field, reduxForm } from 'redux-form'

class AddComment extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      addComment: false
    }
    this.changeCommentStatus = this.changeCommentStatus.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  changeCommentStatus(status){
    this.setState({addComment: status})
  }

  onSubmit(formProps){
    alert("working")
  }

  render(){
    return (
        <div className="columns">
          {this.state.addComment ?
            <form className="inline-label" onSubmit={this.props.handleSubmit(this.onSubmit)}>
              <span id={"comment-form-"+this.props.task.taskId}>
                <Field name="comment" type="text" component="input" placeholder='Type your comment here...' className="comment"/>>
                <button type="submit" className="button primary small">Post</button>
              </span>
            </form> :
            <span>
              <span className="comment text-light">Add a comment...</span>
              <span onClick={(e) => this.changeCommentStatus(true)}>Add</span>
            </span>
          }
        </div>
    )
  }
}

export default (reduxForm({
  form: 'AddComment'
}))(AddComment)
