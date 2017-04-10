import React from 'react'

class TaskListUsers extends React.Component {
    render() {
    return (
	    <div className="content-block">
			<h6>Invited to this list</h6>
			<div className="avatar">
				<img className="memberphoto large" src="assets/img/memberphoto.png" alt="name of user"/>
				<svg className="icon medium green"><use xlinkHref="#icon-ok"></use></svg>
			</div>
			<div className="avatar">
				<img className="memberphoto large" src="assets/img/memberphoto2.png" alt="name of user"/>
				<svg className="icon medium gray"><use xlinkHref="#icon-minus"></use></svg>
			</div>
			<div className="avatar">
				<img className="memberphoto large" src="assets/img/memberphoto3.png" alt="name of user"/>
				<svg className="icon medium orange"><use xlinkHref="#icon-attention"></use></svg>
			</div>
			<div className="avatar">
				<img className="memberphoto large" src="assets/img/memberphoto4.png" alt="name of user"/>
				<svg className="icon medium navy"><use xlinkHref="#icon-arrow-right"></use></svg>
			</div>
			<a><svg className="add icon memberphoto large"><use xlinkHref="#icon-add"></use></svg></a>
		    <button className="button secondary block">Send Text <svg className="icon"><use xlinkHref="#icon-forward"></use></svg></button>
	    </div>
    );
    }
}

export default TaskListUsers
