import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import * as TaskActions from '../../actions/task-actions'
import {bindActionCreators} from 'redux'
import $ from 'jquery'
const  { DOM: { input, select, textarea } } = React

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

  componentDidMount () {
    // console.log("listoftasks didmount")
    // add a comment to a task
    $('body').on('click', '[data-add-comment]', function () {
    	$(this).find('.comment-button').hide();
    	$(this).find('.add-comment').show();
    	$(this).find('.save-comment').show();
    	var save = function save() {
    		// $('.comment-button').show();
    		// $('.add-comment').hide();
    		// $('.save-comment').hide();
    	};
    	$(this).find('.add-comment').one('blur', save).focus();
    	$('.comments-container').on('click', 'button', function () {
    		save();
    	});
    });
  }

  componentDidUpdate () {
    // console.log("listoftasks didupdate")
  }

  changeCommentStatus(status){
    this.setState({addComment: status})
  }

  onSubmit(formProps){
    this.props.taskActions.addTaskComment(this.props.task, formProps)
    this.setState({addComment: false})
    this.setState({value: ''})
    $('.comment-button').show();
    $('.add-comment').hide();
    $('.save-comment').hide();
  }

  render(){
    return (
      <div className="row expanded collapse comment-wrapper">
        <div className="columns shrink">
          <img className="member-photo circle xsmall" src="assets/img/user1.png" alt="name of user"/>
        </div>
        <div className="columns" data-add-comment>
          <span className="comment-button comment text-light">Add a comment...</span>
          <form className="inline-label" onSubmit={this.props.handleSubmit(this.onSubmit)}>
            <Field className="add-comment comment" name="comment" component="textarea" value={this.state.value}/>
            <button type="submit" className="save-comment button primary xsmall">Post</button>
          </form>
        </div>
      </div>
    )
  }
}

{/*}
return (
  <div className="row expanded collapse comment-wrapper">
    <div className="columns shrink">
      <img className="member-photo circle xsmall" src="assets/img/user1.png" alt="name of user"/>
    </div>
    <div className="columns">
      {this.state.addComment ?
        <form className="inline-label" onSubmit={this.props.handleSubmit(this.onSubmit)}>
          <span id={"comment-form-"+this.props.task.taskId}>
            <Field name="comment" type="text" component="input" value={this.state.value} placeholder='Type your comment here...' className="comment"/>
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
*/}

const mapDispatchToProps = function (dispatch) {
  return {
    taskActions: bindActionCreators(TaskActions, dispatch)
  }
}

export default connect(undefined, mapDispatchToProps)(reduxForm({
    form: 'AddComment'
})(AddComment));
