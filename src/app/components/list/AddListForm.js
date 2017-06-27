import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux';

class AddListForm extends React.Component{

  render(){
    return(
      <div className="add-form-wrapper">
        <div className="task-item add-form row expanded">
          <form className="inline-label" onSubmit={this.props.handleSubmit}>
            <div className="column large-12 text-center">
              <h5 className="section-title">Add a list</h5>
            </div>

            {/* <!-- List name --> */}
            <div className="column large-12 input-group no-icon">
              <div className="form-floating-label input-wrapper">
                <Field className="input-group-field" type="text" name="listName" component="input"/>
                <label>List name</label>
              </div>
            </div>

            {/* <!-- Owner --> */}
            <div className="column large-12 input-group no-icon static-label">
              <div className="input-wrapper">
                <label>Owner</label>
                <img className="member-photo circle medium float-right" src="assets/img/user1.png" alt="name of user"/>
              </div>
            </div>

            {/* <!-- Admins --> */}
            <div className="column large-12 input-group no-icon static-label">
              <div className="input-wrapper">
                <label>Admins</label>
                <ul className="menu member-photo-list">
                  <li><span className="add-member circle medium">+</span></li>
                  <li><span className="more-members circle medium">+4</span></li>
                  <li><img className="member-photo circle medium" src="assets/img/user1.png" alt="name of user"/></li>
                  <li><img className="member-photo circle medium" src="assets/img/user2.png" alt="name of user"/></li>
                  <li><span className="member-initials circle medium">SL</span></li>
                  <li><img className="member-photo circle medium" src="assets/img/user3.png" alt="name of user"/></li>
                </ul>
              </div>
            </div>

            {/* <!--Members --> */}
            <div className="column large-12 input-group no-icon static-label accordion" data-accordion data-allow-all-closed="true">
              <div className="input-wrapper accordion-item" data-accordion-item>
                <a href="#" className="accordion-title">
                  <label>Members</label>
                  <ul className="menu member-photo-list">
                    <li><span className="add-member circle medium">+</span></li>
                  </ul>
                </a>
                <div className="accordion-content" data-tab-content>
                    <div className="row collapse expanded align-middle">
                      <div className="columns input-group input-wrapper search-group">
                        <span className="input-group-label">
                          <svg className="icon"><use xlinkHref="#icon-search"></use></svg>
                        </span>
                        <div className="input-wrapper">
                          <input id="add-member-to-list" className="input-group-field" type="text"/>
                        </div>
                      </div>
                    </div>
                  <div className="scroll-wrapper">
                    <div className="row condense expanded border-bottom align-middle">
                      <div className="columns shrink">
                        <img className="member-photo circle medium" src="assets/img/user3.png" alt="name of user"/>
                      </div>
                      <div className="columns">
                        <span className="item-content">Megan Smith</span>
                      </div>
                    </div>
                    <div className="row condense expanded border-bottom align-middle">
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
                    <div className="selected row condense expanded border-bottom align-middle">
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
                  </div>{/* <!--wrapper--> */}


                </div>
              </div>
            </div>


            {/* <!-- Do not disturb --> */}
            <div className="column top-buffer large-12">
              <div className="row collapse">
                <div className="column">
                  <span className="item-content">Do not disturb</span>
                  <span className="details">Fine print about notifications should go here</span>
                </div>
                <div className="column shrink">
                  <div className="switch">
                    <input className="switch-input" id="exampleSwitch" type="checkbox" name="exampleSwitch"/>
                    <label className="switch-paddle" htmlFor="exampleSwitch">
                      <span className="show-for-sr"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- SAVE --> */}
            <div className="column large-12 text-center top-buffer">
              <input type="submit" className="button secondary medium" value="Save"/>
            </div>

          </form>
        </div>
      </div>
    )
  }
}

AddListForm = reduxForm({
  // a unique name for the form
  form: 'addListForm',
  enableReinitialize : true
})(AddListForm)

const mapStateToProps = function(store){
  var initialTaskListValues = {}
  if(store.taskListState.tasklistone){
    initialTaskListValues = store.taskListState.tasklistone
  }
  return{
    initialValues: initialTaskListValues
  }
  // var initialValues = {}
  // if(this.props.taskList){
  //   initialValues = this.props.taskList
  // }
  // return{
  //   initialValues: initialValues
  // }
}

export default connect(mapStateToProps)(AddListForm)
