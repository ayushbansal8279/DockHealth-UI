import React, { useEffect, useState } from 'react';
import { hashHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import TaskTourNarrow from 'img/tour/task-tour/task-tour-narrow';
import TaskTourWide from 'img/tour/task-tour/task-tour-wide';
import { setHeader } from 'actions/header-actions';
import { taskListSelector } from 'selectors/task-list-selectors';
import Header from 'components/taskView/Header';
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

const TaskTourView = ({ routeParams: { taskListIdentifier } }) => {
  const taskLists = useSelector(taskListSelector);
  const dispatch = useDispatch();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', () => setWindowWidth(window.innerWidth));

    onNewUserTourEnter('Task tour view');

    return () => {
      window.removeEventListener('resize', () =>
        setWindowWidth(window.innerWidth),
      );
    };
  }, []);

  useEffect(() => {
    const setViewHeader = () => {
      const loadedTasklist =
        taskLists?.length > 0
          ? taskLists.find(t => t.taskListIdentifier === taskListIdentifier)
          : {};

      const headerComponent = (
        <Header
          isFetching={false}
          title={loadedTasklist.listName}
          taskList={loadedTasklist}
          resetHeader={setViewHeader}
          hasTitle={loadedTasklist.listName}
        />
      );

      if (loadedTasklist.listName) {
        setHeader(dispatch)({
          layout: [
            {
              key: 'header',
              component: headerComponent,
              xs: 12,
            },
          ],
        });
      }
    };

    setViewHeader();
  }, [taskLists, taskListIdentifier, dispatch]);

  return (
    <TaskTourWrapper>
      <Title>How to read your to-dos</Title>
      <Description>
        Before we get to creating a Task, let’s make sure you kno w all the
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
            hashHistory.push(`tasks/${taskListIdentifier}`);
          }}
        >
          Now create your own
        </Button>
      </ButtonWrapper>
    </TaskTourWrapper>
  );
};

export default TaskTourView;
