import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setHeader } from 'actions/header-actions';
import { taskListSelector } from 'selectors/task-list-selectors';
import Header from 'components/taskView/Header';

const TaskTourView = ({ routeParams: { taskListIdentifier } }) => {
  const taskLists = useSelector(taskListSelector);
  const dispatch = useDispatch();

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

  return <div>Task tour</div>;
};

export default TaskTourView;
