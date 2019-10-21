import { shallow } from 'enzyme';
import React from 'react';

import TaskDetails from '../TaskDetails';

jest.mock('../../../api/user-api', () => ({}));

describe('TaskDetails', () => {
  const mockTask = {
    taskId: 0,
    dueDate: '',
    description: 'Just do it.',
    status: 'INCOMPLETE',
    workflowStatus: 'IN_PROGRESS',
    assignedTo: {
      firstName: 'John',
      lastName: 'Smith',
      initials: 'JS',
    },
    assignedBy: {
      firstName: 'Janet',
      lastName: 'Cook',
    },
    patient: null,
    comments: [],
    subtasks: null,
  };

  it('should render correctly w/o patient and subtasks', () => {
    const props = {
      markComplete: jest.fn(),
      close: jest.fn(),
      toggleTaskPriority: jest.fn(),
      addTaskComment: jest.fn(),
      selectedTask: mockTask,
      userId: 142,
    };
    const wrapper = shallow(<TaskDetails {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render incomplete status', () => {
    const props = {
      markComplete: jest.fn(),
      close: jest.fn(),
      toggleTaskPriority: jest.fn(),
      addTaskComment: jest.fn(),
      userId: 142,
      selectedTask: { ...mockTask, status: 'INCOMPLETE' },
    };
    const wrapper = shallow(<TaskDetails {...props} />);
    expect(wrapper.find('StyledCheckbox')).toMatchSnapshot();
  });

  it('should render complete status', () => {
    const props = {
      markComplete: jest.fn(),
      close: jest.fn(),
      toggleTaskPriority: jest.fn(),
      addTaskComment: jest.fn(),
      userId: 142,
      selectedTask: { ...mockTask, status: 'COMPLETE' },
    };
    const wrapper = shallow(<TaskDetails {...props} />);
    expect(wrapper.find('StyledCheckbox')).toMatchSnapshot();
  });

  it('should render disabled flag', () => {
    const props = {
      markComplete: jest.fn(),
      close: jest.fn(),
      toggleTaskPriority: jest.fn(),
      addTaskComment: jest.fn(),
      userId: 142,
      selectedTask: { ...mockTask, priority: 'LOW' },
    };
    const wrapper = shallow(<TaskDetails {...props} />);
    expect(wrapper.find('Bookmark')).toMatchSnapshot();
  });

  it('should render enabled flag', () => {
    const props = {
      markComplete: jest.fn(),
      close: jest.fn(),
      toggleTaskPriority: jest.fn(),
      addTaskComment: jest.fn(),
      userId: 142,
      selectedTask: { ...mockTask, priority: 'HIGH' },
    };
    const wrapper = shallow(<TaskDetails {...props} />);
    expect(wrapper.find('Bookmark')).toMatchSnapshot();
  });

  it('should toggle status', () => {
    const props = {
      markComplete: jest.fn(),
      close: jest.fn(),
      toggleTaskPriority: jest.fn(),
      addTaskComment: jest.fn(),
      userId: 142,
      selectedTask: { ...mockTask, priority: 'LOW' },
    };
    const wrapper = shallow(<TaskDetails {...props} />);
    wrapper.find('Bookmark').simulate('click');
    expect(props.toggleTaskPriority).toBeCalled();
    expect(props.toggleTaskPriority.mock.calls[0][0]).toBe(props.selectedTask);
    expect(props.toggleTaskPriority.mock.calls[0][1]).toBe(
      props.selectedTask.priority,
    );
  });

  it('should render patient', () => {
    const props = {
      markComplete: jest.fn(),
      close: jest.fn(),
      toggleTaskPriority: jest.fn(),
      addTaskComment: jest.fn(),
      userId: 142,
      selectedTask: {
        ...mockTask,
        patient: {
          firstName: 'Jane',
          lastName: 'Doe',
          mrn: '1234567',
        },
      },
    };
    const wrapper = shallow(<TaskDetails {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render subtasks', () => {
    const props = {
      markComplete: jest.fn(),
      close: jest.fn(),
      toggleTaskPriority: jest.fn(),
      addTaskComment: jest.fn(),
      userId: 142,
      selectedTask: { ...mockTask, subtasks: [{ id: 0 }, { id: 1 }] },
    };
    const wrapper = shallow(<TaskDetails {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should fire close', () => {
    const props = {
      markComplete: jest.fn(),
      close: jest.fn(),
      toggleTaskPriority: jest.fn(),
      addTaskComment: jest.fn(),
      userId: 142,
      selectedTask: mockTask,
    };
    const wrapper = shallow(<TaskDetails {...props} />);
    wrapper.find('StyledCloseButton').simulate('click');
    expect(props.close).toBeCalled();
  });
});
