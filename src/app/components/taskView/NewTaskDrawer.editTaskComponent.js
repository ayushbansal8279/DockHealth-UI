import prop from 'ramda/es/prop';
import React, { Component, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { markComplete } from '../../actions/task-actions';
import TaskCheckbox from '../task/TaskCheckbox';
import linkifyHtml from 'linkifyjs/html';

const EditTaskContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  margin-bottom: 0.5rem;
  margin-left: 1.375rem;
`;

const EditTaskDescriptionElement = styled.div`
  box-sizing: border-box;
  color: #303538;
  cursor: text;
  flex: 1;
  font-size: 1.25rem;
  font-weight: 600;
  margin-left: 1rem;
  outline: none;
  padding: 0.0625rem 0.5rem 0.5rem;
  transition: all 0.25s ease-out;

  ${props =>
    props.contentEditable &&
    `
  background-color: #f3f5f6;
  border: 1px solid #dedee2;
  `}
`;

class EditTaskDescription extends Component {
  state = {
    componentEditable: false,
  };

  componentRef = React.createRef();

  componentDidMount() {
    this.resetTextContent();
  }

  componentDidUpdate(prevProps, prevState) {
    const { componentEditable } = this.state;
    const { selectedTask } = this.props;

    if (
      prevState.componentEditable !== componentEditable &&
      componentEditable
    ) {
      // eslint-disable-next-line no-unused-expressions
      this.componentRef.current?.focus();
    }

    if (prevProps.selectedTask?.taskId !== selectedTask?.taskId) {
      this.resetTextContent();
    }
  }

  resetTextContent = () => {
    const { selectedTask } = this.props;
    if (this.state.componentEditable){
      this.componentRef.current.textContent = selectedTask?.description;
    }else{
      const linkifyDescription = linkifyHtml(selectedTask?.description, {
        defaultProtocol: 'https',
        className: 'decorated-link'
      });
      this.componentRef.current.innerHTML = linkifyDescription;
    }
  };

  setComponentEditable = () => {
    this.setState({
      componentEditable: true,
    });
  };

  unsetComponentEditable = (callback = () => {}) => {
    this.setState(
      {
        componentEditable: false,
      },
      callback,
    );
  };

  setDescription = () => {
    const { setDescription, handleSubmit } = this.props;

    const newDescription = this.componentRef.current?.textContent;

    if (newDescription) {
      setDescription(newDescription);
      this.unsetComponentEditable(() => {
        handleSubmit();
      });
    } else {
      toggleAlert('Task description cannot be empty', 'error');
      this.resetTextContent();
      this.unsetComponentEditable();
    }
  };

  handleDescriptionEdit = event => {
    event.preventDefault();
    event.stopPropagation();
    this.setDescription();
  };

  render() {
    const { componentEditable } = this.state;

    return (
      <EditTaskDescriptionElement
        ref={this.componentRef}
        contentEditable={componentEditable}
        onBlur={this.handleDescriptionEdit}
        onKeyPress={event => {
          if (event.key === 'Enter') {
            this.handleDescriptionEdit(event);
          }
        }}
        onClick={componentEditable ? undefined : this.setComponentEditable}
      />
    );
  }
}

export default ({ handleSubmit, onMarkComplete, setAutoSaveVisible }) => {
  const { register, setValue } = useFormContext();
  const selectedTaskId = useSelector(
    store => store.taskState.selectedTask?.taskId,
  );
  const incompleteTasks = useSelector(store => store.taskState.tasks);
  const completeTasks = useSelector(store => store.taskState.completedTasks);
  const currentUser = useSelector(store => store.userState.userProfile);
  const dispatch = useDispatch();

  const allMainTasks = [...incompleteTasks, ...completeTasks];
  const allSubtasks = allMainTasks.flatMap(prop('subtasks'));
  const allTasks = [...allMainTasks, ...allSubtasks];

  const selectedTask = allTasks.find(({ taskId }) => taskId === selectedTaskId);

  const { status } = selectedTask || {};

  const listName = incompleteTasks?.find(
    ({ taskId, subtasks }) =>
      taskId === selectedTaskId ||
      subtasks?.find(({ taskId: subtaskId }) => subtaskId === selectedTaskId),
  )
    ? 'INCOMPLETE'
    : 'COMPLETE';

  const setDescription = useCallback(
    newDescription => {
      setValue('descriptionEdit', newDescription);
    },
    [setValue],
  );

  return (
    <EditTaskContainer>
      <TaskCheckbox
        checked={status === 'COMPLETE'}
        onChange={() => {
          markComplete(selectedTask, status, listName, currentUser)(
            dispatch,
          ).then((...args) => {
            onMarkComplete(...args);
            setAutoSaveVisible();
          });
        }}
      />
      <EditTaskDescription
        setDescription={setDescription}
        handleSubmit={handleSubmit}
        selectedTask={selectedTask}
      />
      <input ref={register} type="hidden" name="descriptionEdit" />
    </EditTaskContainer>
  );
};
