import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import TaskTourNarrow from 'img/tour/task-tour/task-tour-narrow';
import TaskTourWide from 'img/tour/task-tour/task-tour-wide';
import * as TaskListApi from 'api/task-list-api';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import Button from 'components/common/Button/Button';
import { onNewUserTourEnter } from 'helpers/ga-event-helper';
import {
  TaskTourWrapper,
  Title,
  Description,
  TaskTourImgWide,
  TaskTourImgNarrow,
  ImageWrapper,
  ButtonWrapper,
} from './styled';

const TaskTourView = () => {
  const history = useHistory();
  const { taskListIdentifier } = useParams();
  const [taskList, setTaskList] = useState(null);

  const { listName, listDescription } = taskList || {};
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    onNewUserTourEnter('Task tour view');

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    TaskListApi.getTaskListById(taskListIdentifier).then(setTaskList);
  }, [taskListIdentifier]);

  return (
    <ViewLayout
      header={
        <BasicLayoutHeader title={listName} description={listDescription} />
      }
    >
      <TaskTourWrapper>
        <Title>How to read your to-dos</Title>
        <Description>
          Before we get to creating a Task, let’s make sure you know all the
          features on your to-do list.
        </Description>
        <ImageWrapper>
          {windowWidth > 1199 ? (
            <TaskTourImgWide src={TaskTourWide} alt="Task tour" />
          ) : (
            <TaskTourImgNarrow src={TaskTourNarrow} alt="Task tour" />
          )}
        </ImageWrapper>
        <ButtonWrapper>
          <Button
            fullWidth
            onClick={() => {
              onNewUserTourEnter('Navigate to list button click');
              history.push(`/tasks/${taskListIdentifier}`);
            }}
          >
            Now create your own
          </Button>
        </ButtonWrapper>
      </TaskTourWrapper>
    </ViewLayout>
  );
};

export default TaskTourView;
