/* eslint-disable react-hooks/rules-of-hooks */
import React, { useRef, useState, useEffect } from 'react';
import isNil from 'ramda/src/isNil';
import localStorageHelper from 'helpers/local-storage-helper';
import TourPopper from 'components/tour-popover/TourPopper/TourPopper';
import TaskDrawerTourContent from 'components/tour-popover/content/TaskDrawerTourContent/TaskDrawerTourContent';
import StandardTourContent from 'components/tour-popover/content/StandardTourContent/StandardTourContent';
import { onTaskDrawerTourStepEnter } from 'helpers/ga-event-helper';

const TASK_DRAWER_FIRST_TIME_KEY = 'TASK_DRAWER_FIRST_TIME_KEY';
const TASK_DRAWER_FIRST_AUTO_OPEN_KEY = 'TASK_DRAWER_FIRST_AUTO_OPEN_KEY';

const existingUserTaskDrawerTourHooks = ({
  taskDrawerOpen,
  fromFirstAddTask,
  taskDrawerReference,
  hideTour,
}) => {
  const [openedTourStep, setOpenedTourStep] = useState(null);
  const [
    openedFirstQuickAddTaskPopover,
    setOpenedFirstQuickAddTaskPopover,
  ] = useState(false);

  const taskMenuReference = useRef(null);
  const dueDateSectionReference = useRef(null);
  const statusSectionReference = useRef(null);
  const labelsSectionReference = useRef(null);
  const commentsSectionReference = useRef(null);
  const historySectionReference = useRef(null);

  const tourSteps = [
    {
      index: 0,
      reference: taskMenuReference,
      position: 'bottom-end',
      afterScrollPosition: 'start',
      title: 'Adding a Subtask & Deleting or Duplicating Tasks',
      description:
        'We’ve relocated adding a subtask, deleting and duplicating a task to here.',
    },
    {
      index: 1,
      reference: dueDateSectionReference,
      position: 'bottom-start',
      afterScrollPosition: 'start',
      title: 'Due Date & Due Time',
      description:
        'We added the ability to assign a due time for tasks. Based on a due date and time, we‘ll send alerts to remind you a task is due.',
      additionalDescription:
        'Remember that the new Home screen is organized based on due date. Adding due dates will help you stay organized and get things done on time.',
    },
    {
      index: 2,
      reference: statusSectionReference,
      position: 'top-end',
      title: 'Status',
      description:
        'You can now assign a status to a task, which will give you and others an idea of where a task is in process.',
    },
    {
      index: 3,
      reference: labelsSectionReference,
      position: 'top-end',
      title: 'Labels',
      description:
        'We’ve made it easier to search for and find tasks by adding the ability to create and assign searchable labels - like Phone Calls or Imaging - to individual to-dos.',
    },
    {
      index: 4,
      reference: commentsSectionReference,
      position: 'top-end',
      title: 'Editing & Deleting Comments',
      description:
        'Mouse over a comment to expose your ability to edit or delete a comment that you’ve made.',
    },
    {
      index: 5,
      reference: historySectionReference,
      position: 'top-start',
      title: 'Task History',
      description:
        'We’ve added the ability to view an individual task’s history of changes, so you can see each change that occurred since the task was created.',
    },
  ];

  const previousHideTourValue = useRef(null);

  useEffect(() => {
    if (hideTour && !previousHideTourValue && openedTourStep !== null) {
      setOpenedTourStep(null);
    }
    previousHideTourValue.current = hideTour;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hideTour]);

  useEffect(() => {
    if (openedTourStep !== null) {
      const { reference, afterScrollPosition, title } = tourSteps[
        openedTourStep
      ];

      // eslint-disable-next-line no-unused-expressions
      reference?.current.scrollIntoView({
        behavior: 'smooth',
        block: afterScrollPosition || 'center',
      });

      onTaskDrawerTourStepEnter(title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedTourStep]);

  useEffect(() => {
    if (hideTour) return;

    const taskDrawerFirstAutoOpenValue = localStorageHelper.getItem(
      TASK_DRAWER_FIRST_AUTO_OPEN_KEY,
    );
    if (
      fromFirstAddTask &&
      taskDrawerOpen &&
      (isNil(taskDrawerFirstAutoOpenValue) || taskDrawerFirstAutoOpenValue)
    ) {
      setTimeout(() => {
        localStorageHelper.setItem(TASK_DRAWER_FIRST_AUTO_OPEN_KEY, false);
        setOpenedFirstQuickAddTaskPopover(true);
      }, 500);
      return;
    }

    const taskDrawerFirstTimeValue = localStorageHelper.getItem(
      TASK_DRAWER_FIRST_TIME_KEY,
    );

    if (
      taskDrawerOpen &&
      !fromFirstAddTask &&
      (isNil(taskDrawerFirstTimeValue) || taskDrawerFirstTimeValue)
    ) {
      setOpenedTourStep(0);
    }

    if (!taskDrawerOpen && openedTourStep !== null) {
      setOpenedTourStep(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskDrawerOpen]);

  const closeTour = () => {
    localStorageHelper.setItem(TASK_DRAWER_FIRST_TIME_KEY, false);
    setOpenedTourStep(null);
  };

  const renderExistingUserTourPopover = () => {
    return (
      <>
        {openedTourStep !== null &&
          tourSteps.map(({ reference, index, position }) => (
            <TourPopper
              key={index}
              anchorEl={reference?.current}
              position={position}
              open={openedTourStep === index}
              onClose={closeTour}
            >
              <TaskDrawerTourContent
                steps={tourSteps}
                currentStepIndex={index}
                setStep={setOpenedTourStep}
                onClose={closeTour}
              />
            </TourPopper>
          ))}
        {taskDrawerReference?.current && openedFirstQuickAddTaskPopover && (
          <TourPopper
            anchorEl={taskDrawerReference?.current}
            position="left"
            open={openedFirstQuickAddTaskPopover}
            onClose={() => setOpenedFirstQuickAddTaskPopover(false)}
          >
            <StandardTourContent
              title="Would you like to add more details to this task?"
              description="Enter the details you want added and click save. Your task will be ready to go."
              width={369}
            />
          </TourPopper>
        )}
      </>
    );
  };

  return {
    taskMenuReference,
    dueDateSectionReference,
    statusSectionReference,
    labelsSectionReference,
    commentsSectionReference,
    historySectionReference,
    renderExistingUserTourPopover,
  };
};

export default existingUserTaskDrawerTourHooks;
