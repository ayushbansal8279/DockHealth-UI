import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import TaskTourNarrow from 'img/tour/task-tour/task-tour-narrow';
import TaskTourWide from 'img/tour/task-tour/task-tour-wide';
import { setHeader } from 'actions/template-actions';

import * as TaskListApi from 'api/task-list-api';
import ListSelectHeader from 'components/task-view/ListSelectHeader/ListSelectHeader';
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
  const dispatch = useDispatch();
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

  useEffect(() => {
    if (listName) {
      dispatch(
        setHeader({
          layout: [
            {
              key: 'header',
              component: (
                <ListSelectHeader
                  listName={listName}
                  listDescription={listDescription}
                />
              ),
              xs: 12,
            },
          ],
        }),
      );
    }
  }, [dispatch, listName, listDescription]);

  return (
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
  );
};

export default TaskTourView;
