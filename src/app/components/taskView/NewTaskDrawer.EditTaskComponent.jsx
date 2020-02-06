import linkifyElement from 'linkifyjs/element';
import escape from 'lodash.escape';
import React, { Component, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { markComplete } from '../../actions/task-actions';
import {
  formatLinkifyHref,
  mentionifyDescription,
} from '../../helpers/utility-functions';
import TaskCheckbox from '../task/TaskCheckbox';

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
  font-size: 1rem;
  font-weight: 600;
  margin-left: 1rem;
  outline: none;
  padding: 0.1875rem 0.5rem 0.5rem;
  transition: all 0.25s ease-out;

  ${props =>
    props.contentEditable &&
    `
  background-color: #f3f5f6;
  border: 1px solid #dedee2;
  `}

  ${props =>
    props.edited &&
    `
  &::after {
    content: '(edited)';
    color: #aaa9b0;
    font-size: 0.875rem;
    font-weight: normal;
    padding-bottom: 0.25rem;
    margin-left: 0.25rem;
  }
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

  componentDidUpdate(previousProps, previousState) {
    const { componentEditable } = this.state;
    const { selectedTask } = this.props;

    if (
      previousState.componentEditable !== componentEditable &&
      componentEditable
    ) {
      // eslint-disable-next-line no-unused-expressions
      this.componentRef.current?.focus();
    }

    if (previousProps.selectedTask?.taskId !== selectedTask?.taskId) {
      this.resetTextContent();
    }
  }

  linkifyDescriptionElement = () => {
    const { members } = this.props;

    this.componentRef.current.innerHTML = mentionifyDescription({
      members,
      value: escape(this.componentRef.current.textContent),
    });

    linkifyElement(this.componentRef.current, {
      defaultProtocol: 'https',
      className: 'decorated-link',
      formatHref: formatLinkifyHref,
      ignoreTags: ['script', 'style'],
      events: {
        click: event => {
          event.stopPropagation();
        },
      },
    });
  };

  resetTextContent = () => {
    const { selectedTask } = this.props;
    const { componentEditable } = this.state;
    if (componentEditable) {
      this.componentRef.current.innerHTML = escape(selectedTask?.description);
    } else {
      this.componentRef.current.innerHTML = escape(
        selectedTask?.description ?? '',
      );
      this.linkifyDescriptionElement();
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
    this.linkifyDescriptionElement();
    this.setDescription();
  };

  render() {
    const { componentEditable } = this.state;

    let edited = false;
    const { selectedTask } = this.props;
    if (selectedTask) {
      edited = selectedTask.edited;
    }

    return (
      <EditTaskDescriptionElement
        ref={this.componentRef}
        edited={edited}
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

export default ({
  handleSubmit,
  onMarkComplete,
  setAutoSaveVisible,
  members,
}) => {
  const { register, setValue } = useFormContext();
  const selectedTask = useSelector(store => store.taskState.selectedTask);
  const selectedTaskId = selectedTask?.taskId;

  const incompleteTasks = useSelector(store => store.taskState.tasks);
  // const completeTasks = useSelector(store => store.taskState.completedTasks);
  const currentUser = useSelector(store => store.userState.userProfile);
  const dispatch = useDispatch();

  // const allMainTasks = [...incompleteTasks, ...completeTasks];
  // const allSubtasks = allMainTasks.flatMap(prop('subtasks'));
  // const allTasks = [...allMainTasks, ...allSubtasks];

  // const selectedTask = allTasks.find(({ taskId }) => taskId === selectedTaskId);

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
          ).then((...allArguments) => {
            onMarkComplete(...allArguments);
            setAutoSaveVisible();
          });
        }}
      />
      <EditTaskDescription
        setDescription={setDescription}
        handleSubmit={handleSubmit}
        selectedTask={selectedTask}
        members={members}
      />
      <input ref={register} type="hidden" name="descriptionEdit" />
    </EditTaskContainer>
  );
};
