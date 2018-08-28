import React from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import {bindActionCreators} from 'redux';
import Moment from 'react-moment'
import BaseComponent from '../components/BaseComponent'
import * as PatientActions from '../actions/patient-actions'
import * as TaskActions from '../actions/task-actions'
import {mobileAnalyticsClient} from '../api/analytics-api'
import ListOfTasksContainer from '../components/task/ListOfTasksContainer'
import AddTask from '../components/task/AddTask'
import SortFilterTasks from '../components/common/SortFilterTasks'
import axios from 'axios';

class PatientView extends BaseComponent {

  	componentDidMount () {
      this.props.actions.getPatientById(this.props.params.patientId);
      this.props.taskActions.getAllTasksByPatient(this.props.params.patientId, undefined, undefined, "INCOMPLETE");
      mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
              'PageName': 'PatientDetails'
      });
    }
    
    componentDidUpdate(prevProps, prevState) {
      super.componentDidUpdate(prevProps, prevState)
      enableFoundationAccordionComponent(".wrapper")
      
      resizeEmailBodySection(".task-item-wrapper")
    }

    componentWillUnmount(){
      closeAddForm()
    }

    addDashes = (f) =>
    {
      if(f != undefined && f!=""){
        f = f.replace('\+1', '');
        var formattedNumber = f.slice(0,3)+"-"+f.slice(3,6)+"-"+f.slice(6,15);
        return formattedNumber
      }
    }

    setTaskEditingStatus = (isEditing) => {
      // alert("working")
      this.setState({editing: isEditing})
    }
    
    getListTasks = (sortBy, filterBy) => {
      this.props.taskActions.loading()
      this.props.taskActions.getAllTasksByPatient(this.props.params.patientId, sortBy, filterBy, "INCOMPLETE")
    }

    pullCompletedTasks = () => {
      if(!this.props.showingCompletedTasks){
        this.props.taskActions.getAllTasksByPatient(this.props.params.patientId, undefined, undefined, "COMPLETE");
      }else{
        this.props.taskActions.hideCompletedTasks()
      }
    }


    downloadPDF = () => {
      if(this.props.patient.patientId){
        axios({
          url: process.env.HEYDOC_SERVICES_BASE_URL+'list/downloadPDFForPatientTasks?patientId='+this.props.patient.patientId,
          method: 'GET',
          responseType: 'blob', // important
        })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'DOCK_ActionGrid.pdf');
          document.body.appendChild(link);
          link.click();
          return "success";
        }).catch(function (error){
          console.log(error);
          return error.response.data;
        });
      }
    }

    toggleSlimView = () => {
      $(this).toggleClass('active');
      $('.task-item-wrapper').toggleClass('slim');
      $('.task-item .row, .task-item, .main-task-item').toggleClass('align-middle');
    }

		// Lists Activity for a TaskList
    renderList(taskStatus, tasks, members) {
      return(
        <div className="list-wrapper list-wrapper-task-search">
          <div className="task-item-wrapper">
            <ListOfTasksContainer
              taskListId="0" status={taskStatus}
              members={members}
              filteredTasks={tasks}
              setTaskEditingStatus={this.setTaskEditingStatus}
              listName="Patient Tasks"
            />
          </div>
        </div>
      );
    }

    // Lists TaskLists
    renderTaskListName(taskStatus, patientTasks){
      const groupedTasks = this.groupBy(patientTasks, task => task.taskList.listName);
      if(!groupedTasks || groupedTasks.size == 0){
        return <li/>
      }
      return Array.from(groupedTasks.keys()).map((listName) =>{
        const tasks = groupedTasks.get(listName)
        return(
          <li className="accordion-item" key={"taskList_" + listName}>
            <span className="accordion-title task-search-list-name">
              <b>{listName}</b>
            </span>  
            <div>
              {tasks && tasks.length > 0 ? 
                this.renderList(taskStatus, tasks, null) : 
                <p className="light-gray">No matching tasks</p>}
            </div>
          </li>
        );
      })
    }

    render() {
      var patient = {}
      if(this.props.patient){
        patient = this.props.patient
      }

    return (
        <div className="off-canvas-content" data-off-canvas-content="true">
          <div className="row expanded collapse">
            <div className="large-12 columns">

              <div className="top-bar">
                <div className="top-bar-left">
                  <button className="menu-icon hide-for-medium" type="button" data-toggle="sidebar"></button>
                  <h3>{patient.firstName}&nbsp;{patient.lastName}</h3>
                </div>
                <div className="top-bar-right">
                  <div className="icon-text-wrapper">
                    <Link to={"/editPatient/"+patient.patientId} key={patient.patientId}>
                    <svg className="icon"><use xlinkHref="#icon-pencil"></use></svg> Edit
                    </Link>
                  </div>
                </div>
              </div>

              <div className="wrapper slim">
                <div className="item condense row expanded align-middle">
                  <div className="columns large-4">
                    <span className="item-details">MRN</span>
                    <span className="item-content">{patient.mrn}</span>
                  </div>

                  <div className="columns large-4">
                    <span className="item-details">Gender</span>
                    <span className="item-content">{patient.gender}</span>
                  </div>
                  <div className="columns large-4">
                    <span className="item-details">Birthday</span>
                    <span className="item-content">{patient.dob && <Moment format="MMM DD, YYYY">{patient.dob}</Moment>}</span>
                  </div>
                </div>

                <div className="item condense row expanded align-middle">
                  <div className="columns large-4">
                    <span className="item-details">Phone</span>
                    <span className="item-content">{this.addDashes(patient.phoneHome)}</span>
                  </div>
                  <div className="columns large-4">
                    <span className="item-details">Cell</span>
                    <span className="item-content">{this.addDashes(patient.phoneMobile)}</span>
                  </div>
                  <div className="columns large-4">
                    <span className="item-details">Email</span>
                    <span className="item-content">{patient.email}</span>
                  </div>
                </div>

                <div className="item row condense expanded align-middle">
                  <div className="columns large-12">
                    <span className="item-details">Notes</span>
                    <span className="item-content">{patient.notes}</span>
                  </div>
                </div>
              </div>
          </div>
        </div>

          <AddTask
            taskListId={this.props.taskListId}
            addTask={this.props.taskActions.addTask}
            taskLists={this.props.taskList}
            patients={this.props.patients}
            title={this.props.title}
            members={this.props.members}
            activeListMembers={this.props.activeListMembers}
          />

          <SortFilterTasks title="Patient Tasks" getListTasks={this.getListTasks}/>

        <div className="list-wrapper overall-list-wrapper">
          <div className="task-item-wrapper">
            <div className="task-wrapper">
              <div className="row expanded collapse">
                <ul className="columns large-12 accordion task-search-results-container" data-accordion data-allow-all-closed="true">
                  {this.props.tasks && this.renderTaskListName("INCOMPLETE", this.props.tasks)}
                </ul>
                <div className="columns large-12">
                  <div className="show-completed text-center">
                    <a className="toggle-completed button primary small" onClick={(e) => this.pullCompletedTasks()}>Show completed tasks</a>
                  </div>
                </div>
                {this.props.showingCompletedTasks && this.props.completedTasks && this.props.completedTasks.length > 0 &&
                <ul className="columns large-12 accordion task-search-results-container" data-accordion data-allow-all-closed="true">
                  {this.props.completedTasks && this.renderTaskListName("COMPLETE", this.props.completedTasks)}
                </ul>
                }
                {this.props.showingCompletedTasks && this.props.completedTasks && this.props.completedTasks.length == 0 &&
                  <span>No completed tasks</span>
                }          
              </div>
            </div>
          </div>
        </div>

      </div>

    );
  }

  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
  }
}

const mapStateToProps = function (state) {
  return {
    patient: state.patientState.selectedPatient,
    initialValues: state.patientState.selectedPatient,
    members: state.taskListState.tasklistmembers,
    tasks: state.taskState.tasks,
    completedTasks: state.taskState.completedTasks,
    isFetching: state.taskState.isFetching,
    isCompletedTasksFetching: state.taskState.isCompletedTasksFetching,
    showingCompletedTasks: state.taskState.showingCompletedTasks
  }
}

const mapDispatchToProps = function (dispatch) {
  return {
    actions: bindActionCreators(PatientActions, dispatch),
    taskActions: bindActionCreators(TaskActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientView);
