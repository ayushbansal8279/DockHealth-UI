import React from 'react'
import AddTask from '../task/AddTask'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Link} from 'react-router'

class Header extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        value: '',
        title: props.title
      }
    }

    render() {
    return (
      <div>
        <header className="nav-down">
						<div className="top-bar">
							<div className="top-bar-left">
								<button className="menu-icon hide-for-medium" type="button" data-toggle="sidebar"></button>
								<h3>{this.state.title}</h3> 
							</div>
						</div>

						<div className="wrapper list-filter row expanded collapse align-middle align-right">
							<div className="columns controls">
							</div>
							<div className="columns shrink">
								<svg className="add icon"><use xlinkHref="#icon-add"></use></svg>
							</div>
						</div>
        </header>
      </div>
      );
    }
}

const mapStateToProps = function (store) {
  return {
  }
}

const mapDispatchToProps = function (dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
